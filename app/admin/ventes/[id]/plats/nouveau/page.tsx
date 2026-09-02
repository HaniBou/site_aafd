import { notFound } from 'next/navigation';
import { getVenteByIdAdmin } from '@/lib/firebase/fetchers';
import PlatFormClient from '@/components/admin/PlatFormClient';

export const dynamic = 'force-dynamic';

export default async function NouveauPlatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vente = await getVenteByIdAdmin(id);
  if (!vente) notFound();
  return <PlatFormClient venteId={vente.id} venteTitre={vente.titre} />;
}
