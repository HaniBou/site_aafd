import { notFound } from 'next/navigation';
import { getPlatByIdAdmin } from '@/lib/firebase/fetchers';
import PlatFormClient from '@/components/admin/PlatFormClient';

export const dynamic = 'force-dynamic';

export default async function ModifierPlatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plat = await getPlatByIdAdmin(id);
  if (!plat) notFound();
  return <PlatFormClient plat={plat} />;
}
