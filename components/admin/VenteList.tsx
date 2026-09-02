'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import EtatVenteBadge from '@/components/admin/EtatVenteBadge';
import { formatDateJour, type VenteResume } from '@/lib/vente';

export default function VenteList({ ventes }: { ventes: VenteResume[] }) {
  const router = useRouter();
  const notify = useAdminToast();
  const [, startTransition] = useTransition();

  const [suppression, setSuppression] = useState<VenteResume | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supprimer = async (vente: VenteResume) => {
    setError(null);
    setBusyId(vente.id);
    try {
      const res = await fetch(`/api/admin/ventes/${vente.id}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'La suppression a échoué');
      notify('Vente supprimée', 'success');
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setBusyId(null);
      setSuppression(null);
    }
  };

  const enLigne = ventes.filter(v => v.statut === 'ouverte');
  const aVenir = ventes.filter(v => v.statut === 'brouillon');
  const passees = ventes.filter(v => v.statut === 'fermee');

  const carte = (vente: VenteResume) => (
    <div
      key={vente.id}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
        vente.statut === 'ouverte' ? 'border-orange-200' : 'border-gray-200'
      } ${busyId === vente.id ? 'opacity-60' : ''}`}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <EtatVenteBadge etat={vente.etat} />
        </div>

        <Link href={`/admin/ventes/${vente.id}`} className="block group">
          <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
            {vente.titre}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
          <span>
            Retrait :{' '}
            {vente.dateRetrait ? (
              <strong className="text-gray-800">{formatDateJour(vente.dateRetrait)}</strong>
            ) : (
              <strong className="text-amber-700">à définir</strong>
            )}
          </span>
          <span>
            <strong className="text-gray-800">{vente.nbPlats}</strong> plat{vente.nbPlats > 1 ? 's' : ''}
          </span>
          <span>
            <strong className="text-gray-800">{vente.nbCommandes}</strong> commande{vente.nbCommandes > 1 ? 's' : ''}
          </span>
        </div>

      </div>

      <div className="border-t border-gray-100 flex">
        <Link
          href={`/admin/ventes/${vente.id}`}
          className="flex-1 py-3.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors text-center"
        >
          Voir et gérer
        </Link>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => setSuppression(vente)}
          disabled={busyId === vente.id || vente.statut === 'ouverte'}
          title={
            vente.statut === 'ouverte'
              ? 'Clôturez la vente avant de pouvoir la supprimer'
              : undefined
          }
          className="flex-1 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          Supprimer
        </button>
      </div>
    </div>
  );

  const bloc = (titre: string, liste: VenteResume[]) =>
    liste.length > 0 && (
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">{titre}</h2>
        <div className="space-y-3">{liste.map(carte)}</div>
      </section>
    );

  return (
    <>
      <ConfirmModal
        isOpen={!!suppression}
        title="Supprimer cette vente ?"
        message={
          suppression && suppression.nbCommandes > 0
            ? `« ${suppression.titre} », ses ${suppression.nbPlats} plat(s) et ses ${suppression.nbCommandes} commande(s) seront définitivement supprimés, coordonnées des clients comprises. Si vous voulez en garder une trace, exportez d'abord le tableau Excel depuis la page Réservations.`
            : `« ${suppression?.titre} » et ses ${suppression?.nbPlats ?? 0} plat(s) seront définitivement supprimés.`
        }
        confirmLabel={suppression && suppression.nbCommandes > 0 ? 'Oui, tout supprimer' : 'Oui, supprimer'}
        cancelLabel="Non, garder"
        danger
        onConfirm={() => suppression && supprimer(suppression)}
        onCancel={() => setSuppression(null)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventes de plats</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {enLigne.length > 0
                ? 'Une vente est en ligne sur le site'
                : 'Aucune vente en ligne — la page publique annonce la prochaine'}
            </p>
          </div>
          <Link
            href="/admin/ventes/nouveau"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle vente
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2 items-center">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {ventes.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Aucune vente pour le moment</h3>
            <p className="text-sm text-gray-500 mb-5">
              Créez une vente, ajoutez-lui ses plats, puis mettez-la en ligne le moment venu.
            </p>
            <Link
              href="/admin/ventes/nouveau"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors inline-block"
            >
              Créer une vente
            </Link>
          </div>
        ) : (
          <>
            {bloc('En ligne', enLigne)}
            {bloc('En préparation', aVenir)}
            {bloc('Ventes passées', passees)}
          </>
        )}
      </div>
    </>
  );
}
