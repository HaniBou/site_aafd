import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { requireSession } from '@/lib/auth/requireSession';
import { deletePlatImageIfUnused } from '@/lib/platImages';
import type { StatutVente } from '@/types';

export const runtime = 'nodejs';

const STATUTS: StatutVente[] = ['brouillon', 'ouverte', 'fermee'];

function revalidatePublic() {
  revalidatePath('/vente-plats');
  revalidatePath('/');
}

async function reservationsDeLaVente(venteId: string, platIds: string[]): Promise<string[]> {
  const ids = new Set<string>();

  const parVente = await adminDb.collection('reservations').where('venteId', '==', venteId).get();
  for (const doc of parVente.docs) ids.add(doc.id);

  for (let i = 0; i < platIds.length; i += 10) {
    const lot = platIds.slice(i, i + 10);
    const snap = await adminDb.collection('reservations').where('platId', 'in', lot).get();
    for (const doc of snap.docs) ids.add(doc.id);
  }

  return [...ids];
}

async function supprimerParLots(chemins: { collection: string; id: string }[]): Promise<void> {
  for (let i = 0; i < chemins.length; i += 400) {
    const batch = adminDb.batch();
    for (const cible of chemins.slice(i, i + 400)) {
      batch.delete(adminDb.collection(cible.collection).doc(cible.id));
    }
    await batch.commit();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const venteRef = adminDb.collection('ventes').doc(id);
  if (!(await venteRef.get()).exists) {
    return NextResponse.json({ error: 'Vente introuvable' }, { status: 404 });
  }

  const update: Record<string, unknown> = {};
  if (body.titre !== undefined) {
    const titre = String(body.titre).trim();
    if (!titre) {
      return NextResponse.json({ error: 'Le titre de la vente est obligatoire.' }, { status: 400 });
    }
    update.titre = titre;
  }
  if (body.dateLimiteCommande !== undefined) update.dateLimiteCommande = String(body.dateLimiteCommande);
  if (body.dateRetrait !== undefined) update.dateRetrait = String(body.dateRetrait);
  if (body.lieuRetrait !== undefined) update.lieuRetrait = String(body.lieuRetrait);
  if (body.message !== undefined) update.message = String(body.message);

  if (body.statut !== undefined) {
    if (!STATUTS.includes(body.statut)) {
      return NextResponse.json({ error: 'Statut inconnu.' }, { status: 400 });
    }
    update.statut = body.statut;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Aucune modification reçue.' }, { status: 400 });
  }

  if (update.statut === 'ouverte') {
    const autres = await adminDb.collection('ventes').where('statut', '==', 'ouverte').get();
    const batch = adminDb.batch();
    for (const doc of autres.docs) {
      if (doc.id !== id) batch.update(doc.ref, { statut: 'fermee' });
    }
    batch.update(venteRef, update);
    await batch.commit();
  } else {
    await venteRef.update(update);
  }

  revalidatePublic();
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const venteRef = adminDb.collection('ventes').doc(id);
  const venteDoc = await venteRef.get();
  if (!venteDoc.exists) {
    return NextResponse.json({ error: 'Vente introuvable' }, { status: 404 });
  }

  if (venteDoc.data()?.statut === 'ouverte') {
    return NextResponse.json(
      { error: 'Cette vente est en ligne. Clôturez-la avant de la supprimer.' },
      { status: 409 },
    );
  }

  const platsSnap = await adminDb.collection('plats').where('venteId', '==', id).get();
  const plats = platsSnap.docs.map(doc => ({
    id: doc.id,
    image: doc.data().image as string | undefined,
  }));

  const reservationIds = await reservationsDeLaVente(id, plats.map(plat => plat.id));

  await supprimerParLots([
    ...reservationIds.map(reservationId => ({ collection: 'reservations', id: reservationId })),
    ...plats.map(plat => ({ collection: 'plats', id: plat.id })),
    { collection: 'ventes', id },
  ]);

  for (const plat of plats) await deletePlatImageIfUnused(plat.image, plat.id);

  revalidatePublic();
  return NextResponse.json({
    success: true,
    platsSupprimes: plats.length,
    commandesSupprimees: reservationIds.length,
  });
}
