'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Plat, Vente } from '@/types';
import ConfirmModal from '@/components/admin/ConfirmModal';
import PlatList from '@/components/admin/PlatList';
import EtatVenteBadge from '@/components/admin/EtatVenteBadge';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';
import { formatDateCompacte, formatDateJour, type EtatVente } from '@/lib/vente';

type Props = {
  vente: Vente;
  etat: EtatVente;
  plats: Plat[];
  nbCommandes: number;
};

export default function VenteDetail({ vente, etat, plats, nbCommandes }: Props) {
  const router = useRouter();
  const notify = useAdminToast();
  const [, startTransition] = useTransition();

  const [confirmFermeture, setConfirmFermeture] = useState(false);
  const [confirmSuppression, setConfirmSuppression] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enLigne = vente.statut === 'ouverte';

  const changerStatut = async (statut: 'ouverte' | 'fermee') => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/ventes/${vente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Le changement de statut a échoué');
      notify(
        statut === 'ouverte' ? 'Vente en ligne sur le site' : 'Vente clôturée — retirée du site',
        'success',
      );
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setBusy(false);
      setConfirmFermeture(false);
    }
  };

  const supprimer = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/ventes/${vente.id}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        commandesSupprimees?: number;
      };
      if (!res.ok) throw new Error(data.error ?? 'La suppression a échoué');
      notify(
        data.commandesSupprimees
          ? `Vente supprimée avec ses ${data.commandesSupprimees} commande(s)`
          : 'Vente supprimée',
        'success',
      );
      router.push('/admin/ventes');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setBusy(false);
      setConfirmSuppression(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={confirmFermeture}
        title="Clôturer cette vente ?"
        message={`« ${vente.titre} » sera retirée du site et ne sera plus réservable. Les commandes restent consultables. Vous pourrez la remettre en ligne à tout moment.`}
        confirmLabel="Oui, clôturer"
        cancelLabel="Non, garder en ligne"
        danger={false}
        onConfirm={() => changerStatut('fermee')}
        onCancel={() => setConfirmFermeture(false)}
      />

      <ConfirmModal
        isOpen={confirmSuppression}
        title="Supprimer cette vente ?"
        message={
          nbCommandes > 0
            ? `« ${vente.titre} », ses ${plats.length} plat(s) et ses ${nbCommandes} commande(s) seront définitivement supprimés, coordonnées des clients comprises. Si vous voulez en garder une trace, exportez d'abord le tableau Excel depuis la page Réservations.`
            : `« ${vente.titre} » et ses ${plats.length} plat(s) seront définitivement supprimés.`
        }
        confirmLabel={nbCommandes > 0 ? 'Oui, tout supprimer' : 'Oui, supprimer'}
        cancelLabel="Non, garder"
        danger
        onConfirm={supprimer}
        onCancel={() => setConfirmSuppression(false)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/admin/ventes"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Toutes les ventes
        </Link>

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

        <div
          className={`bg-white rounded-2xl border shadow-sm overflow-hidden mb-6 ${
            enLigne ? 'border-orange-200' : 'border-gray-200'
          }`}
        >
          <div className="px-5 py-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <EtatVenteBadge etat={etat} />
              {nbCommandes > 0 && (
                <Link
                  href="/admin/reservations"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
                >
                  {nbCommandes} commande{nbCommandes > 1 ? 's' : ''} reçue{nbCommandes > 1 ? 's' : ''}
                </Link>
              )}
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-1.5">{vente.titre}</h1>

            <p className="text-sm text-gray-600">
              {vente.dateLimiteCommande && (
                <>Commandes jusqu&apos;au {formatDateJour(vente.dateLimiteCommande)} · </>
              )}
              {vente.dateRetrait ? (
                <>Retrait le {formatDateCompacte(vente.dateRetrait)}</>
              ) : (
                <span className="text-amber-700">Retrait à définir</span>
              )}
              {vente.lieuRetrait && <> · {vente.lieuRetrait}</>}
            </p>

            <div className="mt-4">
              {enLigne ? (
                <Button
                  variant="secondary"
                  size="lg"
                  shape="rounded"
                  fullWidth
                  onClick={() => setConfirmFermeture(true)}
                  disabled={busy}
                >
                  Clôturer la vente
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    shape="rounded"
                    fullWidth
                    onClick={() => changerStatut('ouverte')}
                    disabled={busy || plats.length === 0}
                  >
                    Mettre en ligne sur le site
                  </Button>
                  {plats.length === 0 && (
                    <p className="mt-2 text-center text-sm text-amber-700">
                      Ajoutez au moins un plat pour pouvoir mettre la vente en ligne.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 flex">
            <Link
              href={`/admin/ventes/${vente.id}/modifier`}
              className="flex-1 py-3.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors text-center"
            >
              Modifier
            </Link>
            <div className="w-px bg-gray-100" />
            <button
              onClick={() => setConfirmSuppression(true)}
              disabled={busy || enLigne}
              title={enLigne ? 'Clôturez la vente avant de pouvoir la supprimer' : undefined}
              className="flex-1 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              Supprimer
            </button>
          </div>
        </div>

        <PlatList plats={plats} venteId={vente.id} />
      </div>
    </>
  );
}
