import type { StatistiquesVisites as Stats } from '@/lib/statistiques';

const nf = new Intl.NumberFormat('fr-FR');

/** « 2026-09-08 » → « lundi 8 septembre ». */
function libelleJour(date: string): string {
  const [annee, mois, jour] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(annee, mois - 1, jour, 12)));
}

/** « 2026-09-08 » → « septembre 2026 ». */
function libelleMois(date: string): string {
  const [annee, mois] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(annee, mois - 1, 1, 12)));
}

function nomPage(chemin: string): string {
  if (chemin === '/') return 'Accueil';
  return chemin
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\//g, ' › ')
    .replace(/^./, c => c.toUpperCase());
}

function Tuile({ label, valeur }: { label: string; valeur: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {/* Chiffres proportionnels : `tabular-nums` desserre les grands nombres. */}
      <p className="text-3xl font-semibold text-gray-900 leading-none">
        {nf.format(valeur)}
      </p>
    </div>
  );
}

type Ligne = { cle: string; libelle: string; valeur: number };

/** Barres horizontales proportionnelles au premier de la liste. */
function Classement({ titre, lignes }: { titre: string; lignes: Ligne[] }) {
  if (lignes.length === 0) return null;
  const max = Math.max(...lignes.map(l => l.valeur), 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{titre}</h3>
      <ul className="space-y-2 mb-0">
        {lignes.map(ligne => (
          <li key={ligne.cle}>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <span className="text-sm text-gray-700 truncate">{ligne.libelle}</span>
              <span className="text-sm text-gray-500 tabular-nums shrink-0">
                {nf.format(ligne.valeur)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${max > 0 ? (ligne.valeur / max) * 100 : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatistiquesVisites({ stats }: { stats: Stats }) {
  const aujourdhui = stats.jours[stats.jours.length - 1]?.date ?? '';
  const maxJour = Math.max(...stats.jours.map(j => j.visites), 0);

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-0">Fréquentation du site</h2>
          <p className="text-sm text-gray-500 mb-0">
            Nombre de personnes venues sur le site public
          </p>
        </div>
      </div>

      {stats.totalVues === 0 ? (
        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-0">
          Le compteur vient d&apos;être installé. Les premières visites apparaîtront ici
          dès que des personnes consulteront le site.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Tuile label="Aujourd'hui" valeur={stats.visitesAujourdhui} />
            <Tuile
              label={`En ${libelleMois(aujourdhui)}`}
              valeur={stats.visitesCeMois}
            />
            <Tuile label="Depuis le début" valeur={stats.totalVisites} />
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Visites des 14 derniers jours
          </h3>
          <div className="flex items-end gap-1.5 sm:gap-2 h-32 mb-1">
            {stats.jours.map(jour => {
              const vide = jour.visites === 0;
              // Plancher à 4 % pour qu'une journée à 1 visite reste visible
              // à côté d'une journée à 200.
              const hauteur = Math.max((jour.visites / maxJour) * 100, 4);

              return (
                <div
                  key={jour.date}
                  className="group relative flex-1 max-w-6 h-full flex flex-col justify-end"
                >
                  <div
                    role="img"
                    aria-label={`${libelleJour(jour.date)} : ${jour.visites} visite${jour.visites > 1 ? 's' : ''}`}
                    // Une journée vide garde un trait de base : elle doit se
                    // lire comme « zéro visite », pas comme une barre absente.
                    style={vide ? undefined : { height: `${hauteur}%` }}
                    className={`w-full rounded-t-[4px] transition-colors ${
                      vide ? 'h-0.5 bg-gray-200' : 'bg-blue-700 group-hover:bg-blue-800'
                    }`}
                  />

                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                    {libelleJour(jour.date)} — {nf.format(jour.visites)} visite
                    {jour.visites > 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-1.5 sm:gap-2 border-t border-gray-200 pt-1.5 mb-8">
            {stats.jours.map(jour => (
              <span
                key={jour.date}
                className="flex-1 max-w-6 text-center text-[10px] text-gray-400 tabular-nums"
              >
                {Number(jour.date.slice(8, 10))}
              </span>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <Classement
              titre="Pages les plus consultées"
              lignes={stats.pages.map(p => ({
                cle: p.chemin,
                libelle: nomPage(p.chemin),
                valeur: p.vues,
              }))}
            />
            <Classement
              titre="D'où viennent les visiteurs"
              lignes={stats.sources.map(s => ({
                cle: s.source,
                libelle: s.source,
                valeur: s.visites,
              }))}
            />
          </div>

          {stats.depuis && (
            <p className="text-xs text-gray-400 mt-6 mb-0">
              Mesure anonyme, sans cookie, depuis le {libelleJour(stats.depuis)}.
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default StatistiquesVisites;
