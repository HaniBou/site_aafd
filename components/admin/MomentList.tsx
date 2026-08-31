'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Moment } from '@/types';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';

export default function MomentList({ moments }: { moments: Moment[] }) {
  const router = useRouter();
  const notify = useAdminToast();
  const [, startTransition] = useTransition();

  const [deleteTarget, setDeleteTarget] = useState<Moment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/moments/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      notify('Photo supprimée avec succès', 'success');
      refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer cette photo ?"
        message={`« ${deleteTarget?.titre} » sera retirée du site et l'image supprimée définitivement.`}
        confirmLabel="Supprimer définitivement"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-0">Moments partagés</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              {moments.length} photo{moments.length > 1 ? 's' : ''} — galerie en bas de la page Témoignages
            </p>
          </div>
          <Link href="/admin/moments/nouveau"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une photo
          </Link>
        </div>

        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2 items-center">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{deleteError}</p>
            <button onClick={() => setDeleteError(null)} className="text-red-500 hover:text-red-700" aria-label="Fermer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Empty state */}
        {moments.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-1">Aucune photo pour le moment</p>
            <p className="text-sm text-gray-600 mb-5">
              Tant que la galerie est vide, la section n&apos;apparaît pas sur le site.
            </p>
            <Link href="/admin/moments/nouveau"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm inline-block transition-colors">
              Ajouter une photo
            </Link>
          </div>
        )}

        {/* Grille */}
        {moments.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moments.map(moment => (
              <div key={moment.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {moment.image && moment.image !== 'none' ? (
                    <Image src={moment.image} alt={moment.titre} fill className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                      Image manquante
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{moment.titre}</h3>
                  <p className="text-xs text-gray-600">
                    {new Date(moment.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="border-t border-gray-100 flex">
                  <Link href={`/admin/moments/${moment.id}/modifier`}
                    className="flex-1 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                    Modifier
                  </Link>
                  <div className="w-px bg-gray-100" />
                  <button onClick={() => setDeleteTarget(moment)}
                    className="flex-1 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
