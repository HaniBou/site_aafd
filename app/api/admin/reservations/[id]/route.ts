import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { lignesDeCommande } from '@/lib/commande';

export const runtime = 'nodejs';

async function checkSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) throw new Error('Unauthorized');
  await verifySessionToken(token);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await checkSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const reservationDoc = await adminDb.collection('reservations').doc(id).get();

  if (!reservationDoc.exists) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  try {
    return await cancelReservation(id, reservationDoc.data()!);
  } catch (error) {
    console.error('[reservations] annulation', error);
    return NextResponse.json(
      { error: "L'annulation a échoué. Merci de réessayer." },
      { status: 500 },
    );
  }
}

// Annule toute la commande et remet chaque plat en stock (sauf ceux qui ont
// ete supprimes entre-temps).
async function cancelReservation(id: string, data: FirebaseFirestore.DocumentData) {
  const lignes = lignesDeCommande(data).filter(ligne => ligne.platId && ligne.quantite > 0);

  const platDocs = lignes.length > 0
    ? await adminDb.getAll(...lignes.map(ligne => adminDb.collection('plats').doc(ligne.platId)))
    : [];
  const existants = new Set(platDocs.filter(doc => doc.exists).map(doc => doc.id));

  const batch = adminDb.batch();
  batch.delete(adminDb.collection('reservations').doc(id));

  for (const ligne of lignes) {
    if (!existants.has(ligne.platId)) continue;
    batch.update(adminDb.collection('plats').doc(ligne.platId), {
      quantite: FieldValue.increment(ligne.quantite),
    });
  }

  await batch.commit();

  revalidatePath('/vente-plats');
  revalidatePath('/');
  return NextResponse.json({
    success: true,
    stockRestitue: existants.size === lignes.length,
  });
}
