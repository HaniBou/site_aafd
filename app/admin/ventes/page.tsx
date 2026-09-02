import { getVentesAdmin, getPlatsAdmin, getReservationsAdmin } from '@/lib/firebase/fetchers';
import VenteList from '@/components/admin/VenteList';
import { etatVente, type VenteResume } from '@/lib/vente';

export const dynamic = 'force-dynamic';

export default async function AdminVentesPage() {
  const [ventes, plats, reservations] = await Promise.all([
    getVentesAdmin(),
    getPlatsAdmin(),
    getReservationsAdmin(),
  ]);

  const venteIdParPlat = new Map(plats.map(plat => [plat.id, plat.venteId]));

  const resumes: VenteResume[] = ventes.map(vente => {
    const commandes = reservations.filter(
      reservation =>
        (reservation.venteId ?? venteIdParPlat.get(reservation.platId)) === vente.id,
    );
    return {
      ...vente,
      etat: etatVente(vente),
      nbPlats: plats.filter(plat => plat.venteId === vente.id).length,
      nbCommandes: commandes.length,
    };
  });

  return <VenteList ventes={resumes} />;
}
