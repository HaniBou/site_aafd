'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EMPLACEMENTS_PHOTOS, type EmplacementPhoto, type PhotosSite } from '@/lib/photosSite';
import { uploadImage } from '@/lib/uploadImage';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';

type Envoi = { cle: string; phase: 'compressing' | 'uploading'; pourcent: number; apercu: string };

const GROUPES = [...new Set(EMPLACEMENTS_PHOTOS.map(e => e.page))];

export default function PhotosSiteClient({ personnalisees }: { personnalisees: Partial<PhotosSite> }) {
  const router = useRouter();
  const notify = useAdminToast();
  const [, startTransition] = useTransition();
  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  const [envoi, setEnvoi] = useState<Envoi | null>(null);
  const [aRemettre, setARemettre] = useState<EmplacementPhoto | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const enregistrer = async (cle: string, image: string | null) => {
    const res = await fetch('/api/admin/photos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cle, image }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(data.error ?? 'Erreur serveur');
    }
    startTransition(() => router.refresh());
  };

  const changerPhoto = async (emplacement: EmplacementPhoto, fichier: File) => {
    setErreur(null);
    const apercu = URL.createObjectURL(fichier);
    setEnvoi({ cle: emplacement.cle, phase: 'compressing', pourcent: 0, apercu });

    let urlEnvoyee: string | null = null;
    try {
      urlEnvoyee = await uploadImage(fichier, (phase, pourcent) =>
        setEnvoi({ cle: emplacement.cle, phase, pourcent, apercu }),
      );
      await enregistrer(emplacement.cle, urlEnvoyee);
      notify(`Photo « ${emplacement.nom} » mise à jour`, 'success');
    } catch (err) {
      if (urlEnvoyee) {
        await fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlEnvoyee }),
        }).catch(() => {});
      }
      setErreur(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      URL.revokeObjectURL(apercu);
      setEnvoi(null);
    }
  };

  const remettreOriginale = async () => {
    if (!aRemettre) return;
    const emplacement = aRemettre;
    setARemettre(null);
    setErreur(null);
    try {
      await enregistrer(emplacement.cle, null);
      notify(`Photo d'origine remise pour « ${emplacement.nom} »`, 'success');
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!aRemettre}
        title="Remettre la photo d'origine ?"
        message={`La photo actuelle de « ${aRemettre?.nom} » sera supprimée et remplacée par celle d'origine.`}
        confirmLabel="Remettre l'originale"
        onConfirm={remettreOriginale}
        onCancel={() => setARemettre(null)}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-0">Photos du site</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cliquez sur « Changer la photo » pour remplacer une image. Elle apparaît sur le site
            dans la minute.
          </p>
        </div>

        {erreur && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2 items-center">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 flex-1">{erreur}</p>
            <button onClick={() => setErreur(null)} className="text-red-500 hover:text-red-700" aria-label="Fermer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {GROUPES.map(groupe => (
          <section key={groupe} className="mb-10">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{groupe}</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EMPLACEMENTS_PHOTOS.filter(e => e.page === groupe).map(emplacement => {
                const personnalisee = personnalisees[emplacement.cle];
                const enCours = envoi?.cle === emplacement.cle ? envoi : null;
                const src = enCours?.apercu ?? personnalisee ?? emplacement.defaut;
                const estBandeau = emplacement.cle.startsWith('bandeau_');

                return (
                  <div key={emplacement.cle}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                    <div className={`relative bg-gray-100 ${estBandeau ? 'aspect-[3/1]' : 'aspect-[4/3]'}`}>
                      <Image src={src} alt={emplacement.nom} fill className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={!!enCours} />
                      <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full shadow ${
                        personnalisee ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700'
                      }`}>
                        {personnalisee ? 'Photo modifiée' : "Photo d'origine"}
                      </span>
                    </div>

                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-900 leading-snug mb-0">{emplacement.nom}</h3>
                        <a href={emplacement.chemin} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline shrink-0 mt-0.5">
                          Voir ↗
                        </a>
                      </div>
                      <p className="text-sm text-gray-600 mb-0">{emplacement.aide}</p>

                      {enCours && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1.5">
                            {enCours.phase === 'compressing'
                              ? 'Optimisation de la photo…'
                              : `Envoi — ${enCours.pourcent}%`}
                          </p>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-200 ${
                                enCours.phase === 'compressing' ? 'bg-gray-300 animate-pulse' : 'bg-emerald-700'
                              }`}
                              style={{ width: enCours.phase === 'uploading' ? `${enCours.pourcent}%` : '40%' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 p-3 flex flex-col gap-2">
                      <Button variant="primary" size="sm" shape="rounded" fullWidth
                        disabled={!!envoi}
                        onClick={() => inputsRef.current[emplacement.cle]?.click()}>
                        {enCours ? 'Envoi en cours…' : 'Changer la photo'}
                      </Button>
                      {personnalisee && (
                        <Button variant="ghost" size="sm" shape="rounded" fullWidth
                          disabled={!!envoi}
                          onClick={() => setARemettre(emplacement)}>
                          Remettre la photo d&apos;origine
                        </Button>
                      )}
                      <input
                        ref={el => { inputsRef.current[emplacement.cle] = el; }}
                        type="file" accept="image/*" className="hidden"
                        onChange={e => {
                          const fichier = e.target.files?.[0];
                          e.target.value = '';
                          if (fichier) changerPhoto(emplacement, fichier);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
