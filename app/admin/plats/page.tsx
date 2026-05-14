import { getPlatsAdmin } from '@/lib/firebase/fetchers';
import PlatList from '@/components/admin/PlatList';

export const dynamic = 'force-dynamic';

export default async function AdminPlatsPage() {
  const plats = await getPlatsAdmin();
  return <PlatList plats={plats} />;
}
