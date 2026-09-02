'use client';

import { Fragment, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Plat, Reservation } from '@/types';
import ConfirmModal from '@/components/admin/ConfirmModal';
import EtatVenteBadge from '@/components/admin/EtatVenteBadge';
import { useAdminToast } from '@/components/admin/AdminToast';
import { formatDateJour, type VenteAvecEtat } from '@/lib/vente';

type GroupePlat = {
  key: string;
  platId?: string;
  platNom: string;
  reservations: Reservation[];
  total: number;
};

type GroupeVente = {
  key: string;
  vente?: VenteAvecEtat;
  titre: string;
  plats: GroupePlat[];
  nbReservations: number;
  total: number;
  archive: boolean;
};

const SANS_VENTE = 'sans-vente';

function formatDate(iso: string): string {
  if (!iso) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

function exportCSV(groupes: GroupeVente[]) {
  const headers = ['Vente', 'Retrait', 'Plat', 'Quantité', 'Client', 'Email', 'Téléphone', 'Message', 'Commandé le'];
  const rows = groupes.flatMap(groupe =>
    groupe.plats.flatMap(plat =>
      plat.reservations.map(r => [
        groupe.titre,
        formatDateJour(groupe.vente?.dateRetrait) || '',
        plat.platNom,
        String(r.quantite), r.clientNom, r.clientEmail,
        r.clientTelephone, r.message ?? '', formatDate(r.dateReservation),
      ]),
    ),
  );
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

export default function ReservationList({
  reservations,
  plats,
  ventes,
}: {
  reservations: Reservation[];
  plats: Plat[];
  ventes: VenteAvecEtat[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [clotureTarget, setClotureTarget] = useState<GroupeVente | null>(null);
  const [archivesOuvertes, setArchivesOuvertes] = useState(false);
  const notify = useAdminToast();

  const refresh = () => startTransition(() => router.refresh());

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      const res = await fetch(`/api/admin/reservations/${cancelTarget.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'annulation");
      notify(
        data.stockRestitue
          ? 'Réservation annulée — stock remis à jour'
          : "Réservation annulée (le plat associé n'existe plus)",
        'success',
      );
      refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur inattendue', 'error');
    } finally {
      setCancelTarget(null);
    }
  };

  const changerStatut = async (groupe: GroupeVente, statut: 'ouverte' | 'fermee') => {
    if (!groupe.vente) return;
    try {
      const res = await fetch(`/api/admin/ventes/${groupe.vente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      });
      if (!res.ok) throw new Error(statut === 'fermee' ? 'La clôture a échoué' : 'La réouverture a échoué');
      notify(
        statut === 'fermee'
          ? `« ${groupe.titre} » clôturée — retirée du site`
          : `« ${groupe.titre} » remise en ligne`,
        'success',
      );
      refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur inattendue', 'error');
    } finally {
      setClotureTarget(null);
    }
  };

  const platsById = useMemo(() => new Map(plats.map(p => [p.id, p])), [plats]);
  const ventesById = useMemo(() => new Map(ventes.map(v => [v.id, v])), [ventes]);

  const groupes = useMemo(() => {
    const map = new Map<string, GroupeVente>();

    for (const r of reservations) {
      const plat = r.platId ? platsById.get(r.platId) : undefined;
      const venteId = r.venteId || plat?.venteId || '';
      const vente = venteId ? ventesById.get(venteId) : undefined;
      const cle = vente?.id ?? SANS_VENTE;

      let groupe = map.get(cle);
      if (!groupe) {
        groupe = {
          key: cle,
          vente,
          titre: vente?.titre ?? r.venteTitre ?? 'Commandes sans vente rattachée',
          plats: [],
          nbReservations: 0,
          total: 0,
          archive: !vente || vente.statut === 'fermee',
        };
        map.set(cle, groupe);
      }

      const clePlat = r.platId || `nom:${r.platNom}`;
      let groupePlat = groupe.plats.find(item => item.key === clePlat);
      if (!groupePlat) {
        groupePlat = {
          key: clePlat,
          platId: plat?.id,
          platNom: plat?.nom ?? r.platNom,
          reservations: [],
          total: 0,
        };
        groupe.plats.push(groupePlat);
      }

      groupePlat.reservations.push(r);
      groupePlat.total += r.quantite;
      groupe.nbReservations += 1;
      groupe.total += r.quantite;
    }

    return [...map.values()].sort((a, b) => {
      if (a.archive !== b.archive) return a.archive ? 1 : -1;
      return (b.vente?.dateRetrait ?? '').localeCompare(a.vente?.dateRetrait ?? '');
    });
  }, [reservations, platsById, ventesById]);

  const groupesEnCours = groupes.filter(g => !g.archive);
  const groupesArchives = groupes.filter(g => g.archive);

  const totalEnCours = groupesEnCours.reduce((sum, g) => sum + g.total, 0);
  const total = reservations.reduce((sum, r) => sum + r.quantite, 0);

  const renderGroupe = (groupe: GroupeVente) => (
    <div
      key={groupe.key}
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${
        groupe.archive ? 'border-gray-200' : 'border-orange-100'
      }`}
    >
      <div
        className={`border-b px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 ${
          groupe.archive ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-100'
        }`}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {groupe.vente ? (
              <EtatVenteBadge etat={groupe.vente.etat} />
            ) : (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border text-gray-600 bg-gray-100 border-gray-200">
                HISTORIQUE
              </span>
            )}
            {groupe.vente?.dateRetrait && (
              <span className="text-xs text-gray-600">
                Retrait le {formatDateJour(groupe.vente.dateRetrait)}
              </span>
            )}
          </div>
          {groupe.vente ? (
            <Link
              href={`/admin/ventes/${groupe.vente.id}`}
              className="font-bold text-gray-900 text-sm hover:text-orange-600 transition-colors"
            >
              {groupe.titre}
            </Link>
          ) : (
            <p className="font-bold text-gray-900 text-sm">{groupe.titre}</p>
          )}
          <p className="text-xs text-gray-600">
            {groupe.nbReservations} commande{groupe.nbReservations > 1 ? 's' : ''} ·{' '}
            {groupe.plats.length} plat{groupe.plats.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className={`text-xs font-medium ${groupe.archive ? 'text-gray-600' : 'text-orange-600'}`}>
              Portions
            </p>
            <p className={`text-xl font-black leading-none ${groupe.archive ? 'text-gray-700' : 'text-orange-600'}`}>
              {groupe.total}
            </p>
          </div>

          {groupe.vente && (
            <button
              type="button"
              onClick={() =>
                groupe.vente!.statut === 'fermee'
                  ? changerStatut(groupe, 'ouverte')
                  : setClotureTarget(groupe)
              }
              className={`print:hidden text-sm font-semibold px-4 min-h-11 rounded-xl border transition-colors ${
                groupe.vente.statut === 'fermee'
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  : 'text-gray-700 bg-white hover:bg-gray-100 border-gray-300'
              }`}
            >
              {groupe.vente.statut === 'fermee' ? 'Remettre en ligne' : 'Clôturer la vente'}
            </button>
          )}
        </div>
      </div>

      {groupe.plats.map(groupePlat => (
        <div key={groupePlat.key}>
          <div className="px-5 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-800 truncate">{groupePlat.platNom}</p>
            <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full shrink-0">
              {groupePlat.total} portion{groupePlat.total > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {groupePlat.reservations.map(r => (
              <div key={r.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    groupe.archive ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    × {r.quantite}
                  </span>
                  <span className="text-xs text-gray-600">{formatDate(r.dateReservation)}</span>
                  {r.emailEnvoye === true && (
                    <span className="print:hidden flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full border border-green-100">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmation envoyée
                    </span>
                  )}
                  {r.emailEnvoye === false && (
                    <span className="print:hidden flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-100"
                      title={r.emailErreur ?? ''}>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Email non envoyé
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Client</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{r.clientNom}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Email</p>
                      <a href={`mailto:${r.clientEmail}`}
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate block transition-colors">
                        {r.clientEmail}
                      </a>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Téléphone</p>
                      <a href={`tel:${r.clientTelephone}`}
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                        {r.clientTelephone}
                      </a>
                    </div>
                  </div>

                  <button onClick={() => setCancelTarget(r)}
                    className="print:hidden sm:self-center flex items-center justify-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 min-h-11 rounded-xl transition-colors shrink-0">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Annuler
                  </button>
                </div>

                {r.message && (
                  <div className="mt-3 flex gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <svg className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-xs text-gray-700 leading-relaxed">{r.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <ConfirmModal
        isOpen={!!cancelTarget}
        title="Annuler la réservation ?"
        message={`La réservation de ${cancelTarget?.clientNom} pour "${cancelTarget?.platNom}" (×${cancelTarget?.quantite}) sera annulée et la quantité remise en stock.`}
        confirmLabel="Oui, annuler la réservation"
        cancelLabel="Non, conserver"
        danger={false}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      <ConfirmModal
        isOpen={!!clotureTarget}
        title="Clôturer cette vente ?"
        message={`« ${clotureTarget?.titre} » sera retirée du site et ne sera plus réservable. Les ${clotureTarget?.nbReservations ?? 0} commande(s) restent consultables ici. Vous pourrez la remettre en ligne à tout moment.`}
        confirmLabel="Oui, clôturer la vente"
        cancelLabel="Non, garder en ligne"
        danger={false}
        onConfirm={() => clotureTarget && changerStatut(clotureTarget, 'fermee')}
        onCancel={() => setClotureTarget(null)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="hidden print:block mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold">Liste des réservations — AAFD</h1>
          <p className="text-sm text-gray-600 mt-1">
            Imprimé le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} · {reservations.length} réservation{reservations.length > 1 ? 's' : ''} · {total} portion{total > 1 ? 's' : ''} au total
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {reservations.length} réservation{reservations.length > 1 ? 's' : ''} — {groupesEnCours.length} vente{groupesEnCours.length > 1 ? 's' : ''} en cours
              {groupesArchives.length > 0 && `, ${groupesArchives.length} archivée${groupesArchives.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 print:hidden">
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-center">
              <p className="text-xs font-medium text-purple-600">À préparer</p>
              <p className="text-2xl font-black text-purple-700 leading-none mt-0.5">{totalEnCours}</p>
            </div>

            {reservations.length > 0 && (
              <>
                <button onClick={() => exportCSV(groupes)}
                  title="Télécharger la liste des commandes pour l'ouvrir dans Excel"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Tableau Excel</span>
                </button>

                <button onClick={() => window.print()}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="hidden sm:inline">Imprimer</span>
                </button>
              </>
            )}
          </div>
        </div>

        {reservations.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">Aucune réservation pour le moment</p>
            <p className="text-sm text-gray-500">Les commandes de plats apparaîtront ici automatiquement.</p>
          </div>
        )}

        {reservations.length > 0 && (
          <div className="hidden print:block">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #111' }}>
                  <th style={{ padding: '4px 6px', textAlign: 'left' }}>Plat</th>
                  <th style={{ padding: '4px 6px', textAlign: 'center' }}>Qté</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left' }}>Client</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left' }}>Téléphone</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {groupes.map(groupe => (
                  <Fragment key={groupe.key}>
                    <tr style={{ background: '#e5e7eb', borderTop: '2px solid #111' }}>
                      <td colSpan={6} style={{ padding: '5px 6px', fontWeight: 700 }}>
                        {groupe.titre}
                        {groupe.vente?.dateRetrait && (
                          <span style={{ fontWeight: 400 }}> — retrait le {formatDateJour(groupe.vente.dateRetrait)}</span>
                        )}
                        <span style={{ fontWeight: 400, color: '#374151' }}> — {groupe.total} portion(s)</span>
                      </td>
                    </tr>
                    {groupe.plats.flatMap(groupePlat =>
                      groupePlat.reservations.map((r, i) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          {i === 0 ? (
                            <td rowSpan={groupePlat.reservations.length} style={{ padding: '4px 6px', fontWeight: 700, borderRight: '1px solid #d1d5db', verticalAlign: 'top' }}>
                              {groupePlat.platNom}
                              <br /><span style={{ fontWeight: 400, color: '#6b7280' }}>total : {groupePlat.total}</span>
                            </td>
                          ) : null}
                          <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700 }}>×{r.quantite}</td>
                          <td style={{ padding: '4px 6px' }}>{r.clientNom}</td>
                          <td style={{ padding: '4px 6px' }}>{r.clientTelephone}</td>
                          <td style={{ padding: '4px 6px' }}>{r.clientEmail}</td>
                          <td style={{ padding: '4px 6px', color: '#6b7280' }}>{r.message ?? ''}</td>
                        </tr>
                      )),
                    )}
                  </Fragment>
                ))}
                <tr style={{ borderTop: '2px solid #111', background: '#f3f4f6', fontWeight: 700 }}>
                  <td style={{ padding: '4px 6px' }}>TOTAL</td>
                  <td style={{ padding: '4px 6px', textAlign: 'center' }}>{total}</td>
                  <td colSpan={4} />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="space-y-4 print:hidden">
          {groupesEnCours.map(renderGroupe)}
        </div>

        {groupesArchives.length > 0 && (
          <div className="mt-8 print:hidden">
            <button
              type="button"
              onClick={() => setArchivesOuvertes(v => !v)}
              aria-expanded={archivesOuvertes}
              className="w-full flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </span>
                <span className="text-left min-w-0">
                  <span className="block text-sm font-bold text-gray-900">Ventes clôturées</span>
                  <span className="block text-xs text-gray-500">
                    {groupesArchives.length} vente{groupesArchives.length > 1 ? 's' : ''} — conservées ici, retirées du site
                  </span>
                </span>
              </span>
              <svg
                className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${archivesOuvertes ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {archivesOuvertes && (
              <div className="space-y-4 mt-4">{groupesArchives.map(renderGroupe)}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
