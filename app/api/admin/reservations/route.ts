import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { getReservationsAdmin } from '@/lib/firebase/fetchers';

export const runtime = 'nodejs';

async function checkSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) throw new Error('Unauthorized');
  await verifySessionToken(token);
}

export async function GET() {
  try {
    await checkSession();
    const items = await getReservationsAdmin();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
}
