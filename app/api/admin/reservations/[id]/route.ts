import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';

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

async function cancelReservation(id: string, data: FirebaseFirestore.DocumentData) {
  const platId = data.platId as string | undefined;
  const quantite = Number(data.quantite);

  // Le plat a pu être supprimé depuis. `batch.update` sur un document absent
  // fait échouer tout le lot : la réservation devenait alors impossible à
  // annuler. On ne restitue le stock que si le plat existe encore.
  let platExiste = false;
  if (platId) {
    platExiste = (await adminDb.collection('plats').doc(platId).get()).exists;
  }

  const batch = adminDb.batch();
  batch.delete(adminDb.collection('reservations').doc(id));

  if (platExiste && Number.isFinite(quantite) && quantite > 0) {
    batch.update(adminDb.collection('plats').doc(platId!), {
      quantite: FieldValue.increment(quantite),
    });
  }

  await batch.commit();

  revalidatePath('/vente-plats');
  revalidatePath('/');
  return NextResponse.json({ success: true, stockRestitue: platExiste });
}
