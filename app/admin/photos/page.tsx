import { getPhotosPersonnalisees } from '@/lib/firebase/fetchers';
import PhotosSiteClient from '@/components/admin/PhotosSiteClient';

export const dynamic = 'force-dynamic';

export default async function AdminPhotosPage() {
  const personnalisees = await getPhotosPersonnalisees();
  return <PhotosSiteClient personnalisees={personnalisees} />;
}
