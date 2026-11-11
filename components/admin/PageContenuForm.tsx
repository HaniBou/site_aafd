'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  champsDePage,
  erreurTexte,
  trouverPage,
  type ChampContenu,
  type ContenuSite,
} from '@/lib/contenuSite';
import { uploadImage } from '@/lib/uploadImage';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/Button';

type Valeurs = Record<string, string>;

function sans<T>(objet: Record<string, T>, cle: string): Record<string, T> {
  const copie = { ...objet };
  delete copie[cle];
  return copie;
}

const FORMAT_APERCU: Record<'paysage' | 'portrait' | 'bandeau', string> = {
  paysage: 'aspect-[4/3] w-full max-w-sm',
  portrait: 'aspect-[4/5] w-full max-w-[12rem]',
  bandeau: 'aspect-[3/1] w-full',
};

const CHAMP_CLASSES =
  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
  'text-base bg-gray-50 focus:bg-white outline-none transition-colors';

export default function PageContenuForm({
  pageId,
  personnalise,
}: {
  pageId: string;
  personnalise: Partial<ContenuSite>;
}) {
  const page = trouverPage(pageId)!;
  const champs = champsDePage(page);
  const router = useRouter();
  const notify = useAdminToast();

  // base = ce qui est en ligne ; valeurs = ce qui est en cours de saisie.
  const [base, setBase] = useState<Valeurs>(() =>
    Object.fromEntries(champs.map(champ => [champ.cle, personnalise[champ.cle] ?? champ.defaut])),
  );
  const [valeurs, setValeurs] = useState<Valeurs>(base);
  const [fichiers, setFichiers] = useState<Record<string, File>>({});
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGlobale, setErreurGlobale] = useState<string | null>(null);
  const [avancement, setAvancement] = useState<string | null>(null);
  const [confirmerSortie, setConfirmerSortie] = useState(false);

  const apercus = useMemo(
    () => Object.fromEntries(Object.entries(fichiers).map(([cle, f]) => [cle, URL.createObjectURL(f)])),
    [fichiers],
  );
  useEffect(() => () => Object.values(apercus).forEach(url => URL.revokeObjectURL(url)), [apercus]);

  const modifies = champs.filter(champ => fichiers[champ.cle] || valeurs[champ.cle] !== base[champ.cle]);
  const aDesModifications = modifies.length > 0;
  const occupe = avancement !== null;

  useEffect(() => {
    if (!aDesModifications) return;
    const prevenir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', prevenir);
    return () => window.removeEventListener('beforeunload', prevenir);
  }, [aDesModifications]);

  const changerValeur = (cle: string, valeur: string) => {
    setValeurs(v => ({ ...v, [cle]: valeur }));
    setErreurs(e => sans(e, cle));
  };

  const changerFichier = (cle: string, fichier: File) => {
    setFichiers(f => ({ ...f, [cle]: fichier }));
  };

  const remettreOriginal = (champ: ChampContenu) => {
    changerValeur(champ.cle, champ.defaut);
    setFichiers(f => sans(f, champ.cle));
  };

  const annuler = () => {
    setValeurs(base);
    setFichiers({});
    setErreurs({});
    setErreurGlobale(null);
  };

  const enregistrer = async () => {
    setErreurGlobale(null);

    const nouvellesErreurs: Record<string, string> = {};
    for (const champ of modifies) {
      const erreur = erreurTexte(champ, valeurs[champ.cle].trim());
      if (erreur) nouvellesErreurs[champ.cle] = erreur;
    }
    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      setErreurGlobale('Certains champs sont à corriger avant d’enregistrer.');
      document
        .getElementById(`champ-${Object.keys(nouvellesErreurs)[0]}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const envoyees: string[] = [];
    try {
      const aEnvoyer = modifies.filter(champ => fichiers[champ.cle]);
      const payload: Record<string, string | null> = {};
      const enLigne: Valeurs = { ...valeurs };

      for (const [i, champ] of aEnvoyer.entries()) {
        const etape = aEnvoyer.length > 1 ? `Envoi de la photo ${i + 1} sur ${aEnvoyer.length}` : 'Envoi de la photo';
        setAvancement(`${etape}…`);
        const url = await uploadImage(fichiers[champ.cle], (phase, pourcent) =>
          setAvancement(phase === 'compressing' ? `${etape} — optimisation…` : `${etape} — ${pourcent} %`),
        );
        envoyees.push(url);
        payload[champ.cle] = url;
        enLigne[champ.cle] = url;
      }

      for (const champ of modifies) {
        if (fichiers[champ.cle]) continue;
        const valeur = champ.type === 'photo' ? valeurs[champ.cle] : valeurs[champ.cle].trim();
        payload[champ.cle] = valeur === champ.defaut ? null : valeur;
        enLigne[champ.cle] = valeur;
      }

      setAvancement('Enregistrement…');
      const res = await fetch('/api/admin/contenu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page.id, valeurs: payload }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? 'Erreur serveur');
      }

      setBase(enLigne);
      setValeurs(enLigne);
      setFichiers({});
      notify(`Page « ${page.nom} » enregistrée`, 'success');
      router.refresh();
    } catch (err) {
      for (const url of envoyees) {
        await fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        }).catch(() => {});
      }
      setErreurGlobale(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setAvancement(null);
    }
  };

  const retour = () => {
    if (aDesModifications) setConfirmerSortie(true);
    else router.push('/admin/pages');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmModal
        isOpen={confirmerSortie}
        title="Quitter sans enregistrer ?"
        message="Vos modifications sur cette page seront perdues."
        confirmLabel="Quitter sans enregistrer"
        cancelLabel="Rester sur la page"
        danger
        onConfirm={() => router.push('/admin/pages')}
        onCancel={() => setConfirmerSortie(false)}
      />

      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" shape="rounded" className="shrink-0 -ml-1"
            onClick={retour} aria-label="Retour aux pages du site">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </Button>
          <span className="w-px h-5 bg-gray-200 shrink-0" aria-hidden="true" />
          <h1 className="text-sm font-bold text-gray-900 truncate min-w-0 mb-0 leading-none flex-1">
            Page « {page.nom} »
          </h1>
          <a href={page.chemin} target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:underline shrink-0">
            Voir la page ↗
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-32 space-y-6">
        {erreurGlobale && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Rien n&apos;a été enregistré</p>
              <p className="text-sm text-red-600 mt-0.5">{erreurGlobale}</p>
            </div>
          </div>
        )}

        {page.sections.map(section => (
          <section key={section.titre} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="px-5 pt-5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0">
              {section.titre}
            </h2>
            <div className="divide-y divide-gray-100">
              {section.champs.map((champ: ChampContenu) => (
                <ChampEditeur
                  key={champ.cle}
                  champ={champ}
                  valeur={valeurs[champ.cle]}
                  apercu={apercus[champ.cle]}
                  nonEnregistre={!!fichiers[champ.cle] || valeurs[champ.cle] !== base[champ.cle]}
                  erreur={erreurs[champ.cle]}
                  desactive={occupe}
                  onValeur={valeur => changerValeur(champ.cle, valeur)}
                  onFichier={fichier => changerFichier(champ.cle, fichier)}
                  onRemettre={() => remettreOriginal(champ)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <p className="flex-1 min-w-[10rem] text-sm mb-0" aria-live="polite">
            {avancement ? (
              <span className="text-gray-700">{avancement}</span>
            ) : aDesModifications ? (
              <span className="font-semibold text-amber-700">
                {modifies.length} modification{modifies.length > 1 ? 's' : ''} non enregistrée{modifies.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-gray-500">Tout est enregistré</span>
            )}
          </p>
          <Button variant="secondary" size="sm" shape="rounded" onClick={annuler}
            disabled={!aDesModifications || occupe}>
            Annuler
          </Button>
          <Button variant="success" size="sm" shape="rounded" onClick={enregistrer}
            disabled={!aDesModifications || occupe}>
            {occupe ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChampEditeur({
  champ,
  valeur,
  apercu,
  nonEnregistre,
  erreur,
  desactive,
  onValeur,
  onFichier,
  onRemettre,
}: {
  champ: ChampContenu;
  valeur: string;
  apercu?: string;
  nonEnregistre: boolean;
  erreur?: string;
  desactive: boolean;
  onValeur: (valeur: string) => void;
  onFichier: (fichier: File) => void;
  onRemettre: () => void;
}) {
  const fichierRef = useRef<HTMLInputElement>(null);
  const id = `champ-${champ.cle}`;
  const differentDeLOriginal = !!apercu || valeur !== champ.defaut;

  return (
    <div className="px-5 py-5" id={id}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <label htmlFor={champ.type === 'photo' ? undefined : `${id}-saisie`}
          className="text-sm font-semibold text-gray-800">
          {champ.nom}
        </label>
        {nonEnregistre && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Non enregistré
          </span>
        )}
        {differentDeLOriginal && (
          <button type="button" onClick={onRemettre} disabled={desactive}
            className="ml-auto text-xs font-semibold text-gray-500 hover:text-gray-800 hover:underline disabled:opacity-50">
            Remettre l&apos;original
          </button>
        )}
      </div>

      {champ.type === 'photo' ? (
        <div className="flex flex-col gap-3">
          <div className={`relative overflow-hidden rounded-xl bg-gray-100 ${FORMAT_APERCU[champ.format]}`}>
            <Image src={apercu ?? valeur} alt={champ.nom} fill className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px" unoptimized={!!apercu} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm" shape="rounded" disabled={desactive}
              onClick={() => fichierRef.current?.click()}>
              Changer la photo
            </Button>
            <span className="text-xs text-gray-500">JPG, PNG, WebP — max 10 Mo</span>
          </div>
          <input ref={fichierRef} type="file" accept="image/*" className="hidden"
            onChange={e => {
              const fichier = e.target.files?.[0];
              e.target.value = '';
              if (fichier) onFichier(fichier);
            }} />
        </div>
      ) : champ.type === 'paragraphes' ? (
        <textarea id={`${id}-saisie`} value={valeur} disabled={desactive}
          onChange={e => onValeur(e.target.value)}
          rows={Math.min(14, Math.max(4, valeur.split('\n').length + 1))}
          className={`${CHAMP_CLASSES} resize-y leading-relaxed ${erreur ? 'border-red-300' : 'border-gray-200'}`} />
      ) : (
        <input id={`${id}-saisie`} type="text" value={valeur} disabled={desactive}
          onChange={e => onValeur(e.target.value)}
          className={`${CHAMP_CLASSES} ${erreur ? 'border-red-300' : 'border-gray-200'}`} />
      )}

      {erreur && <p className="text-sm text-red-600 mt-1.5 mb-0">{erreur}</p>}
      {champ.aide && <p className="text-xs text-gray-500 mt-1.5 mb-0">{champ.aide}</p>}
      {champ.type === 'paragraphes' && (
        <p className="text-xs text-gray-500 mt-1 mb-0">
          Laissez une ligne vide entre deux paragraphes. Entourez des mots de deux étoiles
          (**comme ceci**) pour les mettre en gras. Les liens deviennent cliquables.
        </p>
      )}
    </div>
  );
}
