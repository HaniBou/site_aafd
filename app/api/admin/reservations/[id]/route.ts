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

  const data = reservationDoc.data()!;
  const batch = adminDb.batch();
  batch.delete(adminDb.collection('reservations').doc(id));
  batch.update(adminDb.collection('plats').doc(data.platId as string), {
    quantite: FieldValue.increment(data.quantite as number),
  });
  await batch.commit();

  revalidatePath('/vente-plats');
  return NextResponse.json({ success: true });
}
