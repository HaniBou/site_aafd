import { notFound } from 'next/navigation';
import { getVenteByIdAdmin } from '@/lib/firebase/fetchers';
import VenteFormClient from '@/components/admin/VenteFormClient';

export const dynamic = 'force-dynamic';

export default async function ModifierVentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vente = await getVenteByIdAdmin(id);
  if (!vente) notFound();
  return <VenteFormClient vente={vente} />;
}
