import { getMomentsAdmin } from '@/lib/firebase/fetchers';
import MomentList from '@/components/admin/MomentList';

export const dynamic = 'force-dynamic';

export default async function AdminMomentsPage() {
  const moments = await getMomentsAdmin();
  return <MomentList moments={moments} />;
}
