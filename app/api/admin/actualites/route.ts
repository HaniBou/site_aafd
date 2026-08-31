import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { getActualitesAdmin, buildUniqueActualiteSlug } from '@/lib/firebase/fetchers';

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
    const items = await getActualitesAdmin();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, category, date, image, aLaUne } = body as {
    title: string;
    content: string;
    category: string;
    date: string;
    image: string;
    aLaUne: boolean;
  };

  if (aLaUne) {
    const existing = await adminDb
      .collection('actualites')
      .where('aLaUne', '==', true)
      .get();
    if (!existing.empty) {
      const batch = adminDb.batch();
      existing.docs.forEach(doc => batch.update(doc.ref, { aLaUne: false }));
      await batch.commit();
    }
  }

  const docRef = await adminDb.collection('actualites').add({
    title,
    content,
    category: category || 'Actualité',
    date: date || new Date().toISOString(),
    image: image || 'none',
    slug: await buildUniqueActualiteSlug(title),
    aLaUne: Boolean(aLaUne),
    uploadedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/actualites');
  revalidatePath('/');
  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
