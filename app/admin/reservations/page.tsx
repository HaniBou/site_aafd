import { getReservationsAdmin, getPlatsAdmin } from '@/lib/firebase/fetchers';
import ReservationList from '@/components/admin/ReservationList';

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
  // Les plats servent à savoir quelles ventes sont clôturées et à retrouver
  // le nom à jour d'un plat renommé depuis la réservation.
  const [reservations, plats] = await Promise.all([
    getReservationsAdmin(),
    getPlatsAdmin(),
  ]);
  return <ReservationList reservations={reservations} plats={plats} />;
}
