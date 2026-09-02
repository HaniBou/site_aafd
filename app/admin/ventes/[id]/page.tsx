import { notFound } from 'next/navigation';
import {
  getVenteByIdAdmin,
  getPlatsByVenteAdmin,
  getReservationsAdmin,
} from '@/lib/firebase/fetchers';
import VenteDetail from '@/components/admin/VenteDetail';
import { etatVente } from '@/lib/vente';

export const dynamic = 'force-dynamic';

export default async function AdminVentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vente = await getVenteByIdAdmin(id);
  if (!vente) notFound();

  const [plats, reservations] = await Promise.all([
    getPlatsByVenteAdmin(id),
    getReservationsAdmin(),
  ]);

  const platIds = new Set(plats.map(plat => plat.id));
  const commandes = reservations.filter(
    reservation => reservation.venteId === id || platIds.has(reservation.platId),
  );

  return (
    <VenteDetail
      vente={vente}
      etat={etatVente(vente)}
      plats={plats}
      nbCommandes={commandes.length}
    />
  );
}
