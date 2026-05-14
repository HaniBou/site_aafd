import { notFound } from 'next/navigation';
import { getActualiteByIdAdmin } from '@/lib/firebase/fetchers';
import ActuFormClient from '@/components/admin/ActuFormClient';

export const dynamic = 'force-dynamic';

export default async function ModifierActuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actualite = await getActualiteByIdAdmin(id);
  if (!actualite) notFound();
  return <ActuFormClient actualite={actualite} />;
}
