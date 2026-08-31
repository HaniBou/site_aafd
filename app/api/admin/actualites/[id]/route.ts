import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { buildUniqueActualiteSlug } from '@/lib/firebase/fetchers';

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

  const existing = await adminDb.collection('actualites').doc(id).get();
  const oldImage = existing.data()?.image as string | undefined;
  const oldSlug = existing.data()?.slug as string | undefined;

  // Le slug suit le titre : sans ça, renommer un article laisse une URL
  // qui ne correspond plus à son contenu.
  const { title } = body as { title?: string };
  const update: Record<string, unknown> = { ...(body as Record<string, unknown>) };
  if (title) {
    update.slug = await buildUniqueActualiteSlug(title, id);
  }

  await adminDb.collection('actualites').doc(id).update(update);

  const newImage = (body as { image?: string }).image;
  if (newImage !== undefined && newImage !== oldImage) {
    await deleteCloudinaryImage(oldImage);
  }

  revalidatePath('/actualites');
  revalidatePath('/')
  if (oldSlug) revalidatePath(`/actualites/${oldSlug}`);
  if (update.slug) revalidatePath(`/actualites/${update.slug}`);
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
  const existing = await adminDb.collection('actualites').doc(id).get();
  const imageUrl = existing.data()?.image as string | undefined;
  const slug = existing.data()?.slug as string | undefined;

  await adminDb.collection('actualites').doc(id).delete();
  await deleteCloudinaryImage(imageUrl);

  revalidatePath('/actualites');
  revalidatePath('/');
  if (slug) revalidatePath(`/actualites/${slug}`);
  return NextResponse.json({ success: true });
}
