'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Plat } from '@/types';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';

export default function PlatList({ plats }: { plats: Plat[] }) {
  const router = useRouter();
  const notify = useAdminToast();
  const [, startTransition] = useTransition();

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const setCloture = async (plat: Plat, cloture: boolean) => {
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/plats/${plat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloture }),
      });
      if (!res.ok) throw new Error(cloture ? 'La clôture a échoué' : 'La réouverture a échoué');
      notify(
        cloture
          ? `Vente de « ${plat.nom} » clôturée — retirée du site`
          : `Vente de « ${plat.nom} » rouverte — de nouveau en ligne`,
        'success',
      );
      refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/plats/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Impossible de supprimer le plat');
      notify('Plat supprimé avec succès', 'success');
      refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!confirmId}
        title="Supprimer ce plat ?"
        message="Le plat sera définitivement supprimé. Les réservations existantes ne seront pas affectées."
        confirmLabel="Oui, supprimer"
        cancelLabel="Non, garder"
        danger
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vente de plats</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {plats.length === 0
                ? 'Aucun plat pour le moment'
                : `${plats.length} plat${plats.length > 1 ? 's' : ''} en catalogue`}
            </p>
          </div>
          <Link
            href="/admin/plats/nouveau"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un plat
          </Link>
        </div>

        {/* Delete error */}
        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2 items-center">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700">{deleteError}</p>
            <button onClick={() => setDeleteError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Empty state */}
        {plats.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Aucun plat pour le moment</h3>
            <p className="text-sm text-gray-500 mb-5">Commencez par ajouter votre premier plat à vendre.</p>
            <Link
              href="/admin/plats/nouveau"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors inline-block"
            >
              Ajouter un plat
            </Link>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {plats.map(plat => (
            <div key={plat.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                plat.cloture ? 'border-gray-300 bg-gray-50' : 'border-gray-200'
              }`}>
              <div className="flex gap-0">
                {plat.image && plat.image !== 'none' && (
                  <div className="relative w-28 sm:w-36 shrink-0 self-stretch">
                    <Image src={plat.image} alt={plat.nom} fill className="object-cover" sizes="144px" />
                  </div>
                )}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {plat.cloture && (
                      <span className="text-xs font-bold text-gray-700 bg-gray-200 px-2.5 py-0.5 rounded-full">
                        VENTE CLÔTURÉE
                      </span>
                    )}
                    {plat.typeMenu && (
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                        {plat.typeMenu}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">{plat.nom}</h3>
                  <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">{plat.description}</p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-lg">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm font-bold text-indigo-700">{plat.prix} €</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                      plat.quantite === 0 ? 'bg-red-50' : plat.quantite < 5 ? 'bg-amber-50' : 'bg-green-50'
                    }`}>
                      <span className={`text-sm font-bold ${
                        plat.quantite === 0 ? 'text-red-600' : plat.quantite < 5 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {plat.quantite === 0 ? 'Épuisé' : `${plat.quantite} dispo${plat.quantite > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    {plat.cuisiniers && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {plat.cuisiniers}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-gray-100 flex">
                <Link href={`/admin/plats/${plat.id}/modifier`}
                  className="flex-1 py-3.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Modifier
                </Link>
                <div className="w-px bg-gray-100" />
                <button onClick={() => setCloture(plat, !plat.cloture)}
                  title={plat.cloture
                    ? 'Remettre ce plat en vente sur le site'
                    : 'Retirer ce plat du site — les réservations sont conservées'}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                    plat.cloture
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  {plat.cloture ? 'Rouvrir' : 'Clôturer'}
                </button>
                <div className="w-px bg-gray-100" />
                <button onClick={() => setConfirmId(plat.id)}
                  className="flex-1 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
