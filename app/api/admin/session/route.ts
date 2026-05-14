import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import {
  createSessionToken,
  COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const idToken = body?.idToken as string | undefined;

  if (!idToken) {
    return NextResponse.json({ error: 'idToken requis' }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const sessionToken = await createSessionToken(decoded.uid);

    const store = await cookies();
    store.set({
      name: COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[session]', err);
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}
