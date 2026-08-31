import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { sendReservationEmails } from '@/lib/emails/reservation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  if (!rateLimit(ip, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 },
    );
  }

  const { platNom, clientNom, clientEmail, clientTelephone, quantite, message } =
    await request.json();

  if (!platNom || !clientNom || !clientEmail || !quantite) {
    return NextResponse.json(
      { error: 'Tous les champs requis doivent être remplis' },
      { status: 400 },
    );
  }

  const result = await sendReservationEmails({
    platNom,
    clientNom,
    clientEmail,
    clientTelephone,
    quantite,
    message,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error, emailEnvoye: false }, { status: 502 });
  }

  return NextResponse.json({ success: true, emailEnvoye: true });
}
