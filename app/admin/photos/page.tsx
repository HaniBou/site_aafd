import { redirect } from 'next/navigation';

// Ancienne adresse de la gestion des photos, remplacee par « Pages du site ».
export default function AdminPhotosPage() {
  redirect('/admin/pages');
}
