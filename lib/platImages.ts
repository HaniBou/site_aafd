import { adminDb } from '@/lib/firebase/admin';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export async function deletePlatImageIfUnused(
  imageUrl: string | null | undefined,
  platIdIgnore?: string,
): Promise<void> {
  if (!imageUrl || imageUrl === 'none') return;

  const snap = await adminDb.collection('plats').where('image', '==', imageUrl).get();
  const encoreUtilisee = snap.docs.some(doc => doc.id !== platIdIgnore);
  if (encoreUtilisee) return;

  await deleteCloudinaryImage(imageUrl);
}
