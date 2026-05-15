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
  const { nom, description, typeMenu, cuisiniers, quantite, prix, image } = body;
  const update: Record<string, unknown> = {};
  if (nom !== undefined) update.nom = String(nom);
  if (description !== undefined) update.description = String(description);
  if (typeMenu !== undefined) update.typeMenu = String(typeMenu);
  if (cuisiniers !== undefined) update.cuisiniers = String(cuisiniers);
  if (quantite !== undefined) update.quantite = Number(quantite);
  if (prix !== undefined) update.prix = Number(prix);
  if (image !== undefined) update.image = image ? String(image) : null;

  const existing = await adminDb.collection('plats').doc(id).get();
  const oldImage = existing.data()?.image as string | undefined;

  await adminDb.collection('plats').doc(id).update(update);

  if (image !== undefined && image !== oldImage) {
    await deleteCloudinaryImage(oldImage);
  }
  revalidatePath('/vente-plats');
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
  const existing = await adminDb.collection('plats').doc(id).get();
  const imageUrl = existing.data()?.image as string | undefined;

  await adminDb.collection('plats').doc(id).delete();
  await deleteCloudinaryImage(imageUrl);

  revalidatePath('/vente-plats');
  return NextResponse.json({ success: true });
}
