import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { rateLimit } from '@/lib/rateLimit';
import { sendReservationEmails } from '@/lib/emails/reservation';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_QUANTITE = 10;

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
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

  const platId = clean(body.platId, 128);
  const clientNom = clean(body.clientNom, 120);
  const clientEmail = clean(body.clientEmail, 200);
  const clientTelephone = clean(body.clientTelephone, 40);
  const message = clean(body.message, 2000);
  const quantite = Number(body.quantite);

  if (!platId || !clientNom || !clientTelephone) {
    return NextResponse.json({ error: 'Merci de remplir tous les champs obligatoires.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(clientEmail)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  if (!Number.isInteger(quantite) || quantite < 1 || quantite > MAX_QUANTITE) {
    return NextResponse.json({ error: 'Quantité invalide.' }, { status: 400 });
  }

  const PLAT_INTROUVABLE = "Ce plat n'existe plus.";
  const STOCK_INSUFFISANT = 'Il ne reste plus assez de portions disponibles.';

  const platRef = adminDb.collection('plats').doc(platId);
  const reservationRef = adminDb.collection('reservations').doc();

  let platNom = '';

  try {
    // Transaction atomique : vérification du stock + décrément + création
    // de la réservation. Si deux personnes réservent la dernière portion
    // en même temps, une seule passe.
    await adminDb.runTransaction(async (transaction) => {
      const platDoc = await transaction.get(platRef);
      if (!platDoc.exists) throw new Error(PLAT_INTROUVABLE);

      const data = platDoc.data()!;
      platNom = (data.nom as string) ?? '';
      const currentQty = (data.quantite as number) ?? 0;

      if (currentQty < quantite) {
        throw new Error(STOCK_INSUFFISANT);
      }

      transaction.update(platRef, { quantite: currentQty - quantite });
      transaction.set(reservationRef, {
        platId,
        platNom,
        clientNom,
        clientEmail,
        clientTelephone,
        quantite,
        message,
        emailEnvoye: false,
        emailErreur: null,
        dateReservation: FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    if (reason === PLAT_INTROUVABLE || reason === STOCK_INSUFFISANT) {
      return NextResponse.json({ error: reason }, { status: 409 });
    }
    console.error('[reservations] transaction', error);
    return NextResponse.json(
      { error: "La réservation n'a pas pu être enregistrée. Merci de réessayer." },
      { status: 500 },
    );
  }

  // La réservation est enregistrée : l'échec des emails ne doit plus la remettre
  // en cause, on se contente de le tracer sur le document.
  const emails = await sendReservationEmails({
    platNom,
    clientNom,
    clientEmail,
    clientTelephone,
    quantite,
    message,
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
      platNom,
      emailEnvoye: emails.ok,
    },
    { status: 201 },
  );
}
