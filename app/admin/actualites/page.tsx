import { getActualitesAdmin } from '@/lib/firebase/fetchers';
import ActuList from '@/components/admin/ActuList';

export const dynamic = 'force-dynamic';

export default async function AdminActualitesPage() {
  const actualites = await getActualitesAdmin();
  return <ActuList actualites={actualites} />;
}
