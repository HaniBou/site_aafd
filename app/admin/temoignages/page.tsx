import { getTemoignagesAdmin } from '@/lib/firebase/fetchers';
import TemoignageList from '@/components/admin/TemoignageList';

export const dynamic = 'force-dynamic';

export default async function AdminTemoignagesPage() {
  const temoignages = await getTemoignagesAdmin();
  return <TemoignageList temoignages={temoignages} />;
}
