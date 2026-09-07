'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Actualite } from '@/types';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';

export default function ActuList({ actualites }: { actualites: Actualite[] }) {
  const router = useRouter();
  const notify = useAdminToast();
  const [, startTransition] = useTransition();

  const [deleteTarget, setDeleteTarget] = useState<Actualite | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/actualites/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      notify('Actualité supprimée avec succès', 'success');
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur inattendue');
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer l'actualité ?"
        message={`"${deleteTarget?.title}" sera supprimée définitivement. Cette action est irréversible.`}
        confirmLabel="Supprimer définitivement"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Actualités</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {actualites.length === 0
                ? 'Aucune actualité pour le moment'
                : `${actualites.length} article${actualites.length > 1 ? 's' : ''} publié${actualites.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <Button href="/admin/actualites/nouveau" variant="primary" size="sm" shape="rounded"
            className="w-full sm:w-auto">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une actualité
          </Button>
        </div>

        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2 items-center">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{deleteError}</p>
            <button onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {actualites.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Aucune actualité pour le moment</h3>
            <p className="text-sm text-gray-500 mb-5">Publiez votre première actualité.</p>
            <Button href="/admin/actualites/nouveau" variant="primary" size="sm" shape="rounded">
              Ajouter une actualité
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {actualites.map(actu => (
            <div key={actu.id}
              className={`relative bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                actu.aLaUne ? 'border-orange-300 ring-1 ring-orange-200' : 'border-gray-200'
              }`}>

              {actu.aLaUne && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400" />
              )}

              <div className="flex gap-0">
                {actu.image && actu.image !== 'none' && (
                  <div className="relative w-28 sm:w-36 shrink-0 self-stretch">
                    <Image src={actu.image} alt={actu.title} fill className="object-cover"
                      sizes="144px" />
                  </div>
                )}
                <div className="flex-1 min-w-0 p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {actu.aLaUne && (
                      <span className="bg-orange-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                        À LA UNE
                      </span>
                    )}
                    <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                      {actu.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(actu.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{actu.title}</h3>
                  <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">{actu.content}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 flex">
                <Link href={`/admin/actualites/${actu.id}/modifier`}
                  className="flex-1 py-3.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors text-center">
                  Modifier
                </Link>
                <div className="w-px bg-gray-100" />
                <button onClick={() => setDeleteTarget(actu)}
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
