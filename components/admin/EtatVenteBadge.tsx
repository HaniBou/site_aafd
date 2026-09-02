import { ETAT_VENTE_LABEL, type EtatVente } from '@/lib/vente';

const STYLES: Record<EtatVente, string> = {
  brouillon: 'text-gray-700 bg-gray-100 border-gray-200',
  ouverte: 'text-orange-700 bg-orange-50 border-orange-100',
  'commandes-closes': 'text-amber-700 bg-amber-50 border-amber-200',
  fermee: 'text-gray-600 bg-gray-100 border-gray-200',
};

export default function EtatVenteBadge({ etat }: { etat: EtatVente }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${STYLES[etat]}`}>
      {ETAT_VENTE_LABEL[etat].toUpperCase()}
    </span>
  );
}
