import { getReservationsAdmin } from '@/lib/firebase/fetchers';
import ReservationList from '@/components/admin/ReservationList';

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
  const reservations = await getReservationsAdmin();
  return <ReservationList reservations={reservations} />;
}
