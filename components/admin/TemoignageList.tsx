'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Temoignage } from '@/types';
import ConfirmModal from '@/components/admin/ConfirmModal';

const AVATAR_COLORS = [
  'from-blue-400 to-indigo-500',
  'from-orange-400 to-red-500',
  'from-emerald-400 to-teal-500',
  'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500',
];

export default function TemoignageList({ temoignages }: { temoignages: Temoignage[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [deleteTarget, setDeleteTarget] = useState<Temoignage | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/temoignages/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
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
        title="Supprimer le témoignage ?"
        message={`Le témoignage de "${deleteTarget?.nom}" sera supprimé définitivement. Cette action est irréversible.`}
        confirmLabel="Supprimer définitivement"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Témoignages</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {temoignages.length} témoignage{temoignages.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/admin/temoignages/nouveau"
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un témoignage
          </Link>
        </div>

        {/* Delete error */}
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

        {/* Empty state */}
        {temoignages.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">Aucun témoignage pour le moment</p>
            <p className="text-sm text-gray-400 mb-5">Ajoutez des témoignages de familles ou de bénévoles.</p>
            <Link href="/admin/temoignages/nouveau"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm inline-block">
              Ajouter un témoignage
            </Link>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {temoignages.map((item, i) => (
            <div key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 p-4">
                {/* Avatar */}
                {item.image && item.image !== 'none' ? (
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div className={`h-16 w-16 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{item.nom}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.type === 'Benevole'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {item.type === 'Benevole' ? 'Bénévole' : 'Famille accompagnée'}
                    </span>
                  </div>
                  {item.role && <p className="text-xs text-gray-500 mb-1">{item.role}</p>}
                  <p className="text-xs text-gray-500 italic line-clamp-3 leading-relaxed whitespace-pre-line">
                    &ldquo;{item.contenu}&rdquo;
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Action bar */}
              <div className="border-t border-gray-100 flex">
                <Link href={`/admin/temoignages/${item.id}/modifier`}
                  className="flex-1 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  Modifier
                </Link>
                <div className="w-px bg-gray-100" />
                <button onClick={() => setDeleteTarget(item)}
                  className="flex-1 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
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
