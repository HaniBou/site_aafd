import { notFound } from 'next/navigation';
import { getMomentByIdAdmin } from '@/lib/firebase/fetchers';
import MomentFormClient from '@/components/admin/MomentFormClient';

export const dynamic = 'force-dynamic';

export default async function ModifierMomentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moment = await getMomentByIdAdmin(id);
  if (!moment) notFound();
  return <MomentFormClient moment={moment} />;
}
