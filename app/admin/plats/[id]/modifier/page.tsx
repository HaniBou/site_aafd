import { notFound, redirect } from 'next/navigation';
import { getPlatByIdAdmin, getVenteByIdAdmin } from '@/lib/firebase/fetchers';
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
  if (!plat.venteId) redirect('/admin/ventes');

  const vente = await getVenteByIdAdmin(plat.venteId);
  if (!vente) redirect('/admin/ventes');

  return <PlatFormClient plat={plat} venteId={vente.id} venteTitre={vente.titre} />;
}
