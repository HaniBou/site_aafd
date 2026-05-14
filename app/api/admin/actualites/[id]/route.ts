import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await checkSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { aLaUne } = body as { aLaUne?: boolean };

  if (aLaUne) {
    const existing = await adminDb
      .collection('actualites')
      .where('aLaUne', '==', true)
      .get();
    if (!existing.empty) {
      const batch = adminDb.batch();
      existing.docs
        .filter(doc => doc.id !== id)
        .forEach(doc => batch.update(doc.ref, { aLaUne: false }));
      await batch.commit();
    }
  }

  await adminDb.collection('actualites').doc(id).update(body);
  revalidatePath('/actualites');
  return NextResponse.json({ success: true });
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
  await adminDb.collection('actualites').doc(id).delete();
  revalidatePath('/actualites');
  return NextResponse.json({ success: true });
}
