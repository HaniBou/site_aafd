import Link from 'next/link';
import {
  getActualitesAdmin,
  getPlatsAdmin,
  getReservationsAdmin,
  getTemoignagesAdmin,
} from '@/lib/firebase/fetchers';

export const dynamic = 'force-dynamic';

const SECTIONS = [
  {
    href: '/admin/actualites',
    label: 'Actualités',
    desc: 'Articles, événements, annonces',
    addLabel: '+ Ajouter une actualité',
    color: 'blue',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    ),
  },
  {
    href: '/admin/plats',
    label: 'Vente de plats',
    desc: 'Plats à vendre, prix, quantités',
    addLabel: '+ Ajouter un plat',
    color: 'orange',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    href: '/admin/temoignages',
    label: 'Témoignages',
    desc: 'Familles accompagnées, bénévoles',
    addLabel: '+ Ajouter un témoignage',
    color: 'emerald',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
  {
    href: '/admin/reservations',
    label: 'Réservations',
    desc: 'Commandes de plats reçues',
    addLabel: null,
    color: 'purple',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    ),
  },
];

const COLOR: Record<string, { bg: string; text: string; badge: string; btn: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    badge: 'bg-blue-500',    btn: 'bg-blue-600 hover:bg-blue-700' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  badge: 'bg-orange-500',  btn: 'bg-orange-600 hover:bg-orange-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  badge: 'bg-purple-500',  btn: 'bg-purple-600 hover:bg-purple-700' },
};

export default async function AdminDashboard() {
  const [plats, actualites, temoignages, reservations] = await Promise.all([
    getPlatsAdmin(),
    getActualitesAdmin(),
    getTemoignagesAdmin(),
    getReservationsAdmin(),
  ]);

  const counts = [actualites.length, plats.length, temoignages.length, reservations.length];

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">

      {/* Welcome header */}
      <div className="mb-10">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{today}</p>
        <h1 className="text-3xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 mt-1">Que souhaitez-vous faire aujourd&apos;hui ?</p>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 gap-5 mb-12">
        {SECTIONS.map((s, i) => {
          const c = COLOR[s.color];
          return (
            <div key={s.href} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`${c.bg} px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${c.badge} rounded-xl flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {s.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
                <span className={`text-2xl font-black ${c.text}`}>{counts[i]}</span>
              </div>
              <div className="px-5 py-3">
                <Link href={s.href}
                  className="block w-full text-center py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                  Gérer
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="font-bold text-gray-900">Comment utiliser l&apos;interface ?</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Ajouter du contenu',
              steps: [
                'Cliquez sur "Gérer" dans la section souhaitée',
                'Cliquez sur le bouton "+ Ajouter" en haut de la liste',
                'Remplissez le formulaire et validez',
              ],
            },
            {
              title: 'Modifier un contenu',
              steps: [
                'Trouvez l\'élément dans la liste',
                'Cliquez sur "Modifier"',
                'Changez ce que vous voulez et validez',
              ],
            },
            {
              title: 'Supprimer un contenu',
              steps: [
                'Trouvez l\'élément dans la liste',
                'Cliquez sur "Supprimer"',
                'Confirmez dans la fenêtre qui s\'ouvre',
              ],
            },
            {
              title: 'Réservations de plats',
              steps: [
                'Les commandes arrivent automatiquement',
                'Téléchargez le CSV pour imprimer la liste',
                '"Annuler" remet la quantité en stock',
              ],
            },
          ].map(block => (
            <div key={block.title} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-900 mb-2">{block.title}</p>
              <ol className="space-y-1.5">
                {block.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3 items-start">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-800">
            <strong>Conseil :</strong> après chaque publication, visitez le site pour vérifier que tout s&apos;affiche correctement.
            Les images trop lourdes peuvent ralentir la page — privilégiez des photos de moins de 5 Mo.
          </p>
        </div>
      </div>
    </main>
  );
}
