import {
  getReservationsAdmin,
  getPlatsAdmin,
  getVentesAdmin,
} from '@/lib/firebase/fetchers';
import ReservationList from '@/components/admin/ReservationList';
import { etatVente, type VenteAvecEtat } from '@/lib/vente';

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
  const [reservations, plats, ventes] = await Promise.all([
    getReservationsAdmin(),
    getPlatsAdmin(),
    getVentesAdmin(),
  ]);

  const ventesAvecEtat: VenteAvecEtat[] = ventes.map(vente => ({
    ...vente,
    etat: etatVente(vente),
  }));

  return <ReservationList reservations={reservations} plats={plats} ventes={ventesAvecEtat} />;
}
