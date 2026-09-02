'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Vente } from '@/types';
import { toDateTimeLocalValue, fromDateTimeLocalValue } from '@/lib/vente';
import { useAdminToast } from '@/components/admin/AdminToast';
import DateHeureField from '@/components/admin/DateHeureField';

type FormState = {
  titre: string;
  dateRetrait: string;
  dateLimiteCommande: string;
  lieuRetrait: string;
  message: string;
};

const EMPTY: FormState = {
  titre: '',
  dateRetrait: '',
  dateLimiteCommande: '',
  lieuRetrait: '',
  message: '',
};

function venteToForm(vente: Vente): FormState {
  return {
    titre: vente.titre ?? '',
    dateRetrait: toDateTimeLocalValue(vente.dateRetrait),
    dateLimiteCommande: toDateTimeLocalValue(vente.dateLimiteCommande),
    lieuRetrait: vente.lieuRetrait ?? '',
    message: vente.message ?? '',
  };
}

const CHAMP =
  'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-base bg-white outline-none transition-colors';

const LABEL = 'block text-base font-bold text-gray-900 mb-1';

const AIDE = 'text-sm text-gray-600 mb-2';

export default function VenteFormClient({ vente }: { vente?: Vente }) {
  const router = useRouter();
  const notify = useAdminToast();
  const isEditing = !!vente;

  const [form, setForm] = useState<FormState>(vente ? venteToForm(vente) : EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!form.titre.trim()) return 'Le titre de la vente est obligatoire.';
    if (!form.dateRetrait) return 'La date de retrait est obligatoire.';
    if (!form.lieuRetrait.trim()) return 'Le lieu de retrait est obligatoire.';
    if (
      form.dateLimiteCommande &&
      new Date(form.dateLimiteCommande).getTime() > new Date(form.dateRetrait).getTime()
    ) {
      return 'La date limite de commande doit précéder la date de retrait.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }

    setBusy(true);
    setError(null);

    const body = {
      titre: form.titre.trim(),
      dateRetrait: fromDateTimeLocalValue(form.dateRetrait),
      dateLimiteCommande: fromDateTimeLocalValue(form.dateLimiteCommande),
      lieuRetrait: form.lieuRetrait.trim(),
      message: form.message.trim(),
    };

    try {
      const res = await fetch(isEditing ? `/api/admin/ventes/${vente!.id}` : '/api/admin/ventes', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur');

      notify(isEditing ? 'Vente modifiée' : 'Vente créée', 'success');
      router.push(isEditing ? `/admin/ventes/${vente!.id}` : `/admin/ventes/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setBusy(false);
    }
  };

  const retour = isEditing ? `/admin/ventes/${vente!.id}` : '/admin/ventes';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={retour}
            aria-label="Retour"
            className="flex items-center gap-1.5 shrink-0 -ml-1 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </Link>

          <span className="w-px h-5 bg-gray-200 shrink-0" aria-hidden="true" />

          <h1 className="text-sm font-bold text-gray-900 truncate min-w-0 mb-0 leading-none">
            {isEditing ? `Modifier « ${vente!.titre} »` : 'Nouvelle vente'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Une erreur est survenue</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
          <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-base font-black text-orange-700">
              1
            </span>
            <p className="text-base font-bold text-gray-900">Le nom de la vente</p>
          </div>

          <div>
            <label htmlFor="titre" className={LABEL}>
              Titre <span className="text-orange-600">*</span>
            </label>
            <p className={AIDE}>
              C&apos;est le grand titre que les visiteurs verront sur le site. Indiquez le mois,
              c&apos;est le plus simple.
            </p>
            <input
              id="titre"
              type="text"
              value={form.titre}
              onChange={e => setForm({ ...form, titre: e.target.value })}
              placeholder="Vente de plats de mars"
              className={CHAMP}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className={LABEL}>
              Petit mot d&apos;accompagnement
            </label>
            <p className={AIDE}>
              Facultatif. Une ou deux phrases affichées sous le titre, pour expliquer à quoi sert
              cette vente.
            </p>
            <textarea
              id="message"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={3}
              placeholder="Une vente au profit de la rentrée scolaire des enfants."
              className={`${CHAMP} resize-none`}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
          <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-base font-black text-orange-700">
              2
            </span>
            <p className="text-base font-bold text-gray-900">Les dates</p>
          </div>

          <DateHeureField
            label="Dernier jour pour commander"
            aide="Après cette date, le site n’accepte plus aucune réservation. Laissez vide si vous préférez fermer les commandes vous-même, avec le bouton « Clôturer »."
            value={form.dateLimiteCommande}
            onChange={dateLimiteCommande => setForm({ ...form, dateLimiteCommande })}
            heureDefaut="20:00"
          />

          <div className="border-t border-gray-100 pt-6">
            <DateHeureField
              label="Jour du retrait des plats"
              aide="Le jour et l’heure où les gens viennent chercher leurs plats."
              value={form.dateRetrait}
              onChange={dateRetrait => setForm({ ...form, dateRetrait })}
              requis
              heureDefaut="11:00"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
          <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-base font-black text-orange-700">
              3
            </span>
            <p className="text-base font-bold text-gray-900">Le lieu</p>
          </div>

          <div>
            <label htmlFor="lieu-retrait" className={LABEL}>
              Où venir chercher les plats <span className="text-orange-600">*</span>
            </label>
            <p className={AIDE}>
              L&apos;adresse affichée sur le site et envoyée dans l&apos;email de confirmation.
            </p>
            <input
              id="lieu-retrait"
              type="text"
              value={form.lieuRetrait}
              onChange={e => setForm({ ...form, lieuRetrait: e.target.value })}
              placeholder="Local associatif, 12 rue des Écoles"
              className={CHAMP}
              required
            />
          </div>
        </div>

        <div className="pb-8">
          {!isEditing && (
            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3 items-start">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-amber-800 leading-relaxed">
                Rien n&apos;apparaîtra encore sur le site : vous ajouterez d&apos;abord les plats, puis
                vous cliquerez sur « Mettre en ligne » quand tout sera prêt.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-4 rounded-xl text-base font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
          >
            {busy && (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {busy ? 'Enregistrement…' : isEditing ? 'Enregistrer les modifications' : 'Créer la vente'}
          </button>

          <Link
            href={retour}
            className="mt-3 block w-full py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-base font-semibold text-center"
          >
            Annuler et revenir en arrière
          </Link>
        </div>
      </form>
    </div>
  );
}
