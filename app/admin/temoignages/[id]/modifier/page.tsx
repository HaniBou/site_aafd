import { notFound } from 'next/navigation';
import { getTemoignageByIdAdmin } from '@/lib/firebase/fetchers';
import TemoignageFormClient from '@/components/admin/TemoignageFormClient';

export const dynamic = 'force-dynamic';

export default async function ModifierTemoignagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const temoignage = await getTemoignageByIdAdmin(id);
  if (!temoignage) notFound();
  return <TemoignageFormClient temoignage={temoignage} />;
}
