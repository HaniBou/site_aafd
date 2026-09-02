'use client';

import { useId, useState } from 'react';

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

const JOURS_SEMAINE = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function decouper(value: string): { date: string; heure: string } {
  const trouve = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/.exec(value);
  return trouve ? { date: trouve[1], heure: trouve[2] } : { date: '', heure: '' };
}

function recapitulatif(date: string, heure: string): string {
  const trouve = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!trouve) return '';

  const annee = Number(trouve[1]);
  const mois = Number(trouve[2]);
  const jour = Number(trouve[3]);
  const reference = new Date(annee, mois - 1, jour);
  if (Number.isNaN(reference.getTime())) return '';

  const suffixe = /^(\d{2}):(\d{2})$/.test(heure)
    ? ` à ${Number(heure.slice(0, 2))} h ${heure.slice(3)}`
    : '';

  return `${JOURS_SEMAINE[reference.getDay()]} ${jour} ${MOIS[mois - 1]} ${annee}${suffixe}`;
}

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aide?: string;
  requis?: boolean;
  heureDefaut?: string;
};

const CHAMP =
  'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base bg-gray-50 focus:bg-white outline-none transition-colors';

export default function DateHeureField({
  label,
  value,
  onChange,
  aide,
  requis = false,
  heureDefaut = '18:00',
}: Props) {
  const baseId = useId();
  const initial = decouper(value);

  const [date, setDate] = useState(initial.date);
  const [heure, setHeure] = useState(initial.heure);

  const emettre = (nouvelleDate: string, nouvelleHeure: string) => {
    onChange(nouvelleDate ? `${nouvelleDate}T${nouvelleHeure || heureDefaut}` : '');
  };

  const changerDate = (nouvelleDate: string) => {
    const heureFinale = nouvelleDate && !heure ? heureDefaut : heure;
    setDate(nouvelleDate);
    setHeure(heureFinale);
    emettre(nouvelleDate, heureFinale);
  };

  const changerHeure = (nouvelleHeure: string) => {
    setHeure(nouvelleHeure);
    emettre(date, nouvelleHeure);
  };

  const effacer = () => {
    setDate('');
    setHeure('');
    onChange('');
  };

  const recap = recapitulatif(date, heure);

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="block text-base font-bold text-gray-900 mb-1">
        {label} {requis && <span className="text-orange-600">*</span>}
      </legend>
      {aide && <p className="text-sm text-gray-600 mb-3">{aide}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${baseId}-date`} className="block text-sm font-semibold text-gray-700 mb-1.5">
            Date
          </label>
          <input
            id={`${baseId}-date`}
            type="date"
            value={date}
            onChange={event => changerDate(event.target.value)}
            className={CHAMP}
            required={requis}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-heure`} className="block text-sm font-semibold text-gray-700 mb-1.5">
            Heure
          </label>
          <input
            id={`${baseId}-heure`}
            type="time"
            value={heure}
            onChange={event => changerHeure(event.target.value)}
            className={CHAMP}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        {recap && (
          <p className="text-sm font-semibold text-gray-700">{recap}</p>
        )}
        {date && !requis && (
          <button
            type="button"
            onClick={effacer}
            className="text-sm font-semibold text-gray-600 underline underline-offset-2 hover:text-gray-900"
          >
            Effacer cette date
          </button>
        )}
      </div>
    </fieldset>
  );
}
