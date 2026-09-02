import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import {
  createSessionToken,
  sessionDuration,
  sessionCookieOptions,
  COOKIE_NAME,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const idToken = body?.idToken as string | undefined;
  // Case « Rester connecté » : cochée par défaut côté formulaire, on ne raccourcit
  // la session que si le bénévole l'a explicitement décochée.
  const remember = body?.remember !== false;

  if (!idToken) {
    return NextResponse.json({ error: 'idToken requis' }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const maxAge = sessionDuration(remember);
    const sessionToken = await createSessionToken(decoded.uid, maxAge);

    const store = await cookies();
    store.set({
      name: COOKIE_NAME,
      value: sessionToken,
      ...sessionCookieOptions(maxAge),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[session]', err);
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}
