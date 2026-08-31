import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

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
  const { titre, image, date } = body as {
    titre?: string;
    image?: string;
    date?: string;
  };

  const update: Record<string, unknown> = {};
  if (titre !== undefined) update.titre = String(titre).trim();
  if (date !== undefined) update.date = String(date);
  if (image !== undefined) update.image = String(image);

  const existing = await adminDb.collection('moments').doc(id).get();
  if (!existing.exists) {
    return NextResponse.json({ error: 'Photo introuvable' }, { status: 404 });
  }

  const oldImage = existing.data()?.image as string | undefined;

  await adminDb.collection('moments').doc(id).update(update);

  // L'ancienne image n'est plus référencée nulle part.
  if (image !== undefined && image !== oldImage) {
    await deleteCloudinaryImage(oldImage);
  }

  revalidatePath('/temoignages');
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
  const existing = await adminDb.collection('moments').doc(id).get();
  const imageUrl = existing.data()?.image as string | undefined;

  await adminDb.collection('moments').doc(id).delete();
  await deleteCloudinaryImage(imageUrl);

  revalidatePath('/temoignages');
  return NextResponse.json({ success: true });
}
