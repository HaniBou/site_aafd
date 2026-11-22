import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { rateLimit } from '@/lib/rateLimit';
import { sendReservationEmails } from '@/lib/emails/reservation';
import { venteEstOuverte } from '@/lib/vente';
import { MAX_LIGNES, MAX_PAR_PLAT } from '@/lib/commande';
import type { LigneCommande, Vente } from '@/types';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

// Erreur a montrer telle quelle au client (stock, vente close...).
class ErreurCommande extends Error {}

// Lit le panier envoye par le navigateur : { platId -> quantite }. Seuls les
// identifiants et les quantites sont repris, noms et prix viennent de la base.
function lirePanier(brut: unknown): Map<string, number> | string {
  if (!Array.isArray(brut) || brut.length === 0) return 'Votre commande est vide.';
  if (brut.length > MAX_LIGNES) return 'Commande invalide.';

  const panier = new Map<string, number>();
  for (const ligne of brut as Record<string, unknown>[]) {
    const platId = clean(ligne?.platId, 128);
    const quantite = Number(ligne?.quantite);
    if (!platId || !Number.isInteger(quantite) || quantite < 1) return 'Commande invalide.';
    panier.set(platId, (panier.get(platId) ?? 0) + quantite);
  }
  for (const quantite of panier.values()) {
    if (quantite > MAX_PAR_PLAT) return `Pas plus de ${MAX_PAR_PLAT} portions d'un même plat par commande.`;
  }
  return panier;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  if (!rateLimit(ip, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const clientNom = clean(body.clientNom, 120);
  const clientEmail = clean(body.clientEmail, 200);
  const clientTelephone = clean(body.clientTelephone, 40);
  const panier = lirePanier(body.lignes);

  if (!clientNom || !clientTelephone) {
    return NextResponse.json({ error: 'Merci de remplir tous les champs obligatoires.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(clientEmail)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  if (typeof panier === 'string') {
    return NextResponse.json({ error: panier }, { status: 400 });
  }

  const VENTE_FERMEE = 'Les commandes de cette vente sont closes.';
  const reservationRef = adminDb.collection('reservations').doc();

  let lignes: LigneCommande[] = [];
  let total = 0;
  let venteRetenue: Vente | null = null;

  // Tout ou rien : si un seul plat manque, aucun stock n'est touche.
  try {
    await adminDb.runTransaction(async (transaction) => {
      const platIds = [...panier.keys()];
      const platDocs = await transaction.getAll(
        ...platIds.map(id => adminDb.collection('plats').doc(id)),
      );

      if (platDocs.some(doc => !doc.exists)) {
        throw new ErreurCommande("Un des plats de votre commande n'existe plus. Merci de recharger la page.");
      }

      const venteIds = new Set(platDocs.map(doc => (doc.data()!.venteId as string) ?? ''));
      const [venteId] = venteIds;
      if (venteIds.size !== 1 || !venteId) throw new ErreurCommande(VENTE_FERMEE);

      const venteDoc = await transaction.get(adminDb.collection('ventes').doc(venteId));
      if (!venteDoc.exists) throw new ErreurCommande(VENTE_FERMEE);
      const vente = { id: venteDoc.id, ...venteDoc.data() } as Vente;
      if (!venteEstOuverte(vente)) throw new ErreurCommande(VENTE_FERMEE);

      lignes = platDocs.map(doc => {
        const data = doc.data()!;
        const nom = (data.nom as string) ?? '';
        const stock = (data.quantite as number) ?? 0;
        const quantite = panier.get(doc.id)!;
        if (stock < quantite) {
          throw new ErreurCommande(
            stock <= 0
              ? `« ${nom} » est épuisé. Retirez-le de votre commande.`
              : `Il ne reste que ${stock} « ${nom} ». Ajustez la quantité.`,
          );
        }
        return { platId: doc.id, platNom: nom, quantite, prixUnitaire: Number(data.prix) || 0 };
      });
      total = lignes.reduce((somme, ligne) => somme + ligne.quantite * (ligne.prixUnitaire ?? 0), 0);
      venteRetenue = vente;

      for (const ligne of lignes) {
        transaction.update(adminDb.collection('plats').doc(ligne.platId), {
          quantite: FieldValue.increment(-ligne.quantite),
        });
      }
      transaction.set(reservationRef, {
        venteId,
        venteTitre: vente.titre ?? '',
        clientNom,
        clientEmail,
        clientTelephone,
        lignes,
        total,
        emailEnvoye: false,
        emailErreur: null,
        dateReservation: FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    if (error instanceof ErreurCommande) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('[reservations] transaction', error);
    return NextResponse.json(
      { error: "La commande n'a pas pu être enregistrée. Merci de réessayer." },
      { status: 500 },
    );
  }

  // Le stock affiche sur les pages publiques (mises en cache) doit suivre.
  revalidatePath('/vente-plats');
  revalidatePath('/');

  const vente = venteRetenue as Vente | null;

  const emails = await sendReservationEmails({
    lignes,
    total,
    clientNom,
    clientEmail,
    clientTelephone,
    venteTitre: vente?.titre,
    dateRetrait: vente?.dateRetrait,
    lieuRetrait: vente?.lieuRetrait,
  });

  await reservationRef
    .update({
      emailEnvoye: emails.ok,
      emailErreur: emails.ok ? null : emails.error,
    })
    .catch(() => {});

  return NextResponse.json(
    {
      success: true,
      reservationId: reservationRef.id,
      emailEnvoye: emails.ok,
    },
    { status: 201 },
  );
}
