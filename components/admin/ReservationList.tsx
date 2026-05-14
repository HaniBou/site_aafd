'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Reservation } from '@/types';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

function formatDate(iso: string): string {
  if (!iso) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

function exportCSV(reservations: Reservation[]) {
  const headers = ['Plat', 'Quantité', 'Client', 'Email', 'Téléphone', 'Message', 'Date'];
  const rows = reservations.map(r => [
    r.platNom, String(r.quantite), r.clientNom, r.clientEmail,
    r.clientTelephone, r.message ?? '', formatDate(r.dateReservation),
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

export default function ReservationList({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  const notify = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 5000);
  };

  const refresh = () => startTransition(() => router.refresh());

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      const res = await fetch(`/api/admin/reservations/${cancelTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Erreur lors de l'annulation");
      notify('Réservation annulée — stock remis à jour');
      setCancelTarget(null);
      refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur inattendue');
    }
  };

  const byPlat = reservations.reduce<Record<string, Reservation[]>>((acc, r) => {
    (acc[r.platNom] ??= []).push(r);
    return acc;
  }, {});

  const total = reservations.reduce((sum, r) => sum + r.quantite, 0);
  const platCount = Object.keys(byPlat).length;

  return (
    <>
      <Toast message={toast.message} show={toast.show}
        onClose={() => setToast(t => ({ ...t, show: false }))} />

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

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Réservations</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {reservations.length} réservation{reservations.length > 1 ? 's' : ''} — {platCount} plat{platCount > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Total badge */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-center">
              <p className="text-xs font-medium text-purple-600">Total commandé</p>
              <p className="text-2xl font-black text-purple-700 leading-none mt-0.5">{total}</p>
            </div>

            {/* Export */}
            {reservations.length > 0 && (
              <button onClick={() => exportCSV(reservations)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Télécharger CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {reservations.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">Aucune réservation pour le moment</p>
            <p className="text-sm text-gray-400">Les commandes de plats apparaîtront ici automatiquement.</p>
          </div>
        )}

        {/* Groups by plat */}
        <div className="space-y-4">
          {Object.entries(byPlat).map(([platNom, platReservations]) => {
            const platTotal = platReservations.reduce((s, r) => s + r.quantite, 0);
            return (
              <div key={platNom} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

                {/* Group header */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{platNom}</p>
                      <p className="text-xs text-gray-500">{platReservations.length} commande{platReservations.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-600 font-medium">Total</p>
                    <p className="text-xl font-black text-orange-600 leading-none">{platTotal}</p>
                  </div>
                </div>

                {/* Reservations */}
                <div className="divide-y divide-gray-100">
                  {platReservations.map(r => (
                    <div key={r.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">

                      {/* Top row: quantity + date + badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          × {r.quantite}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(r.dateReservation)}</span>
                        {r.emailEnvoye === true && (
                          <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full border border-green-100">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirmation envoyée
                          </span>
                        )}
                        {r.emailEnvoye === false && (
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-100"
                            title={r.emailErreur ?? ''}>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Email non envoyé
                          </span>
                        )}
                      </div>

                      {/* Client info + cancel */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">Client</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{r.clientNom}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">Email</p>
                            <a href={`mailto:${r.clientEmail}`}
                              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate block transition-colors">
                              {r.clientEmail}
                            </a>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">Téléphone</p>
                            <a href={`tel:${r.clientTelephone}`}
                              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                              {r.clientTelephone}
                            </a>
                          </div>
                        </div>

                        <button onClick={() => setCancelTarget(r)}
                          className="sm:self-center flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2.5 rounded-xl transition-colors shrink-0">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler
                        </button>
                      </div>

                      {/* Message */}
                      {r.message && (
                        <div className="mt-3 flex gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                          <svg className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            );
          })}
        </div>
      </div>
    </>
  );
}
