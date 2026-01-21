import { Metadata } from 'next'

import Link from 'next/link'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Nous rejoindre - AAFD Val de Saône',
  description: 'Rejoignez l\'équipe de bénévoles de l\'AAFD et participez à nos actions de solidarité',
}

export default function NousRejoindre() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Nous rejoindre"
        description="Rejoignez une équipe de bénévoles engagés et participez à des actions concrètes de solidarité sur le Val de Saône."
        imageSrc="/images/hero_nous_rejoindre.webp"
        imageAlt="Nous rejoindre"
        gradientFrom="from-purple-900/90"
        gradientTo="to-purple-800/70"
      />

      {/* Pourquoi nous rejoindre */}
<section className="py-16 md:py-24 bg-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Pourquoi devenir bénévole ?
      </h2>
      <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
        Rejoindre l&apos;AAFD, c&apos;est bien plus qu&apos;un engagement associatif
      </p>
      <div className="mt-4 w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
    </div>

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Carte 1 */}
      <div className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-blue-50 p-4 text-blue-900">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Agir concrètement</h3>
        <p className="text-gray-600 leading-relaxed">
          Participer à des actions qui ont un impact direct et mesurable sur la vie des familles en difficulté.
        </p>
      </div>

      {/* Carte 2 */}
      <div className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-orange-50 p-4 text-orange-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Créer des rencontres</h3>
        <p className="text-gray-600 leading-relaxed">
          Tisser des liens authentiques avec des personnes d&apos;horizons variés et enrichir votre vision du monde.
        </p>
      </div>

      {/* Carte 3 */}
      <div className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-green-50 p-4 text-green-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Développer vos compétences</h3>
        <p className="text-gray-600 leading-relaxed">
          Acquérir de nouvelles compétences en organisation, communication, médiation et gestion de projet.
        </p>
      </div>

      {/* Carte 4 */}
      <div className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-purple-50 p-4 text-purple-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Moments conviviaux</h3>
        <p className="text-gray-600 leading-relaxed">
          Participer à des événements festifs et partager des moments de joie autour de nos actions.
        </p>
      </div>

      {/* Carte 5 */}
      <div className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-red-50 p-4 text-red-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">S&apos;informer</h3>
        <p className="text-gray-600 leading-relaxed">
          Mieux comprendre les enjeux de l&apos;immigration et les réalités des parcours migratoires.
        </p>
      </div>

      {/* Carte 6 */}
      <div className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-yellow-50 p-4 text-yellow-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Engagement flexible</h3>
        <p className="text-gray-600 leading-relaxed">
          Choisir votre niveau d&apos;implication selon vos disponibilités et vos envies.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Les missions - STYLE TIMELINE ÉPURÉE */}
<section className="bg-slate-50 py-20 md:py-28 overflow-hidden">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Nos différentes missions
      </h2>
      <p className="mt-4 text-gray-600">S'engager selon vos compétences et vos envies</p>
    </div>

    <div className="relative border-l-2 border-blue-100 ml-4 md:ml-0 md:left-1/2">
      {[
        { title: "Organisation d'événements", desc: "Ventes de plats, tournois de pétanque et actions environnementales." },
        { title: "Accompagnement administratif", desc: "Aide aux démarches, traduction de documents et rendez-vous officiels." },
        { title: "Cours de français", desc: "Enseignement du FLE pour faciliter l'intégration des familles." },
        { title: "Communication & réseaux sociaux", desc: "Rayonnement de l'association et création de contenus digitaux." },
        { title: "Recherche de partenariats", desc: "Développement du réseau avec les entreprises et collectivités." },
        { title: "Logistique & coordination", desc: "Gestion des stocks, transports et entraide entre bénévoles." }
      ].map((mission, idx) => (
        <div key={idx} className="mb-12 last:mb-0 relative group">
          {/* Le point sur la ligne */}
          <div className="absolute -left-[11px] top-1.25 w-5 h-5 rounded-full bg-blue-600 "></div>
          
          <div className="pl-8 md:group-odd:text-right md:group-odd:pr-8 md:group-odd:pl-0 md:group-odd:-translate-x-full">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{mission.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md md:group-odd:ml-auto">
              {mission.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Comment nous rejoindre - RESTE IMPACTANT */}
      <section className="bg-blue-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">Comment nous rejoindre ?</h2>
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {[
              { step: "1", title: "Contactez-nous", desc: "Un simple email pour nous faire part de votre envie." },
              { step: "2", title: "Rencontrons-nous", desc: "Un échange convivial pour faire connaissance." },
              { step: "3", title: "Participez", desc: "Lancez-vous sur une mission qui vous plaît." }
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="text-5xl font-black text-orange-500 mb-4">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-blue-100 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <a 
            href="/contact"
            className="inline-block rounded-full bg-orange-600 px-10 py-4 text-lg font-bold text-white hover:bg-orange-500 hover:scale-105 transition-all shadow-lg"
          >
            Nous rejoindre
          </a>
        </div>
      </section>      

      {/* FAQ - SANS EMOJIS */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "Faut-il des compétences particulières ?", a: "Non ! Nous accueillons toutes les bonnes volontés. Nous vous accompagnerons dans vos premières missions." },
              { q: "Combien de temps faut-il s'engager ?", a: "Il n'y a pas de durée minimale. Chacun contribue selon ses disponibilités réelles." },
              { q: "Faut-il parler plusieurs langues ?", a: "Pas nécessairement. Le français suffit pour la majorité de nos actions de terrain." },
              { q: "Dois-je habiter sur le Val de Saône ?", a: "C'est préférable pour faciliter vos déplacements, mais pas obligatoire." }
            ].map((item, idx) => (
              <details key={idx} className="group border border-gray-100 rounded-xl bg-slate-50/50 p-6">
                <summary className="list-none cursor-pointer flex justify-between items-center font-bold text-gray-900">
                  {item.q}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>
            Ensemble, créons du lien et de la solidarité
          </h2>
          <p className="mb-8 text-body-large text-blue-100">
            Rejoignez une communauté engagée et bienveillante
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Devenir bénévole
            </a>
            <Link
              href="/actualites"
              className="inline-block rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              Découvrir nos actions
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
