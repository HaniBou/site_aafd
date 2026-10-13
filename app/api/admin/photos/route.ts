import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { requireSession } from '@/lib/auth/requireSession';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { trouverEmplacement } from '@/lib/photosSite';

export const runtime = 'nodejs';

// Remplace la photo d'un emplacement, ou remet celle d'origine si image vaut null.
export async function PUT(request: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { cle, image } = (await request.json().catch(() => ({}))) as {
    cle?: string;
    image?: string | null;
  };

  const emplacement = cle ? trouverEmplacement(cle) : undefined;
  if (!emplacement) {
    return NextResponse.json({ error: 'Emplacement inconnu' }, { status: 400 });
  }
  if (image !== null && (typeof image !== 'string' || !image.startsWith('https://res.cloudinary.com/'))) {
    return NextResponse.json({ error: 'Photo invalide' }, { status: 400 });
  }

  const ref = adminDb.collection('config').doc('photosSite');
  const ancienne = (await ref.get()).data()?.[emplacement.cle] as string | undefined;

  await ref.set(
    { [emplacement.cle]: image ?? FieldValue.delete() },
    { merge: true },
  );

  if (ancienne && ancienne !== image) {
    await deleteCloudinaryImage(ancienne);
  }

  revalidatePath(emplacement.chemin);
  if (emplacement.cle === 'bandeau_actualites') {
    revalidatePath('/actualites/[slug]', 'page');
  }
  revalidatePath('/admin/photos');
  return NextResponse.json({ success: true });
}
