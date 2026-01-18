import { Metadata } from 'next'
import Image from 'next/image'
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
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Pourquoi devenir bénévole ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoindre l&apos;AAFD, c&apos;est bien plus qu&apos;un engagement associatif
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-900 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Agir concrètement
              </h3>
              <p className="text-gray-700">
                Participer à des actions qui ont un impact direct et mesurable sur la vie des familles en difficulté.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange-600 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Créer des rencontres
              </h3>
              <p className="text-gray-700">
                Tisser des liens authentiques avec des personnes d&apos;horizons variés et enrichir votre vision du monde.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-700 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Développer vos compétences
              </h3>
              <p className="text-gray-700">
                Acquérir de nouvelles compétences en organisation, communication, médiation et gestion de projet.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-700 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Moments conviviaux
              </h3>
              <p className="text-gray-700">
                Participer à des événements festifs et partager des moments de joie autour de nos actions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-700 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                S&apos;informer
              </h3>
              <p className="text-gray-700">
                Mieux comprendre les enjeux de l&apos;immigration et les réalités des parcours migratoires.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-yellow-700 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Engagement flexible
              </h3>
              <p className="text-gray-700">
                Choisir votre niveau d&apos;implication selon vos disponibilités et vos envies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les missions */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Nos différentes missions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De nombreuses façons de s&apos;engager selon vos compétences et disponibilités
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              <div className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">📅 Organisation d&apos;événements</h3>
                <p className="text-gray-600">
                  Participer à l&apos;organisation des ventes de plats, du tournoi de pétanque, et des actions environnementales.
                </p>
              </div>

              <div className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">📝 Accompagnement administratif</h3>
                <p className="text-gray-600">
                  Aider les familles dans leurs démarches administratives, traduction de documents, rendez-vous officiels.
                </p>
              </div>

              <div className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🗣️ Cours de français</h3>
                <p className="text-gray-600">
                  Donner des cours de français langue étrangère pour faciliter l&apos;intégration des familles.
                </p>
              </div>

              <div className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">💬 Communication & réseaux sociaux</h3>
                <p className="text-gray-600">
                  Gérer la communication de l&apos;association, les réseaux sociaux, et la création de contenus.
                </p>
              </div>

              <div className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🤝 Recherche de partenariats</h3>
                <p className="text-gray-600">
                  Développer des partenariats avec des entreprises, collectivités et autres associations.
                </p>
              </div>

              <div className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🚚 Logistique & coordination</h3>
                <p className="text-gray-600">
                  Gérer la logistique des événements, les stocks, les transports et la coordination entre bénévoles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Ils témoignent
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="mb-4">
                <svg className="h-8 w-8 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-4 text-lg italic">
                &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.&quot;
              </p>
              <p className="font-semibold text-gray-900">Marie L., bénévole depuis 3 ans</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8">
              <div className="mb-4">
                <svg className="h-8 w-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-4 text-lg italic">
                &quot;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis.&quot;
              </p>
              <p className="font-semibold text-gray-900">Thomas D., bénévole depuis 1 an</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment nous rejoindre */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              Comment nous rejoindre ?
            </h2>
            <p className="text-lg text-blue-100 mb-12">
              Rejoindre l&apos;AAFD est simple et ne demande aucun engagement à long terme
            </p>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="mb-4 text-4xl font-bold text-orange-400">1</div>
                <h3 className="text-lg font-semibold mb-2">Contactez-nous</h3>
                <p className="text-sm text-blue-100">
                  Envoyez-nous un email pour manifester votre intérêt
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="mb-4 text-4xl font-bold text-orange-400">2</div>
                <h3 className="text-lg font-semibold mb-2">Rencontrons-nous</h3>
                <p className="text-sm text-blue-100">
                  Nous organisons une rencontre pour échanger sur vos envies
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="mb-4 text-4xl font-bold text-orange-400">3</div>
                <h3 className="text-lg font-semibold mb-2">Participez</h3>
                <p className="text-sm text-blue-100">
                  Vous commencez à participer aux actions qui vous intéressent
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-lg mb-4 font-semibold">
                Envie de nous rejoindre ?
              </p>
              <p className="text-blue-100 mb-6">
                Contactez-nous par email pour démarrer l&apos;aventure
              </p>
              <a 
                href="mailto:aafd@gmx.fr?subject=Devenir bénévole AAFD"
                className="inline-block rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-500 transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💼 Faut-il avoir des compétences particulières ?
              </h3>
              <p className="text-gray-600">
                Non ! Nous accueillons toutes les bonnes volontés. L&apos;important est d&apos;avoir envie de s&apos;engager 
                pour la solidarité. Nous vous formerons et accompagnerons dans vos missions.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ⏰ Combien de temps faut-il s&apos;engager ?
              </h3>
              <p className="text-gray-600">
                Il n&apos;y a pas de durée minimale d&apos;engagement. Certains bénévoles participent ponctuellement 
                à des événements, d&apos;autres s&apos;impliquent de façon plus régulière. Chacun contribue selon ses disponibilités.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🌍 Faut-il parler plusieurs langues ?
              </h3>
              <p className="text-gray-600">
                Pas nécessairement. Même si la maîtrise de langues étrangères peut être utile pour certaines missions, 
                de nombreuses actions ne nécessitent que le français. Et nous avons souvent recours à des traducteurs.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📍 Dois-je habiter sur le Val de Saône ?
              </h3>
              <p className="text-gray-600">
                C&apos;est préférable car nos actions se déroulent principalement sur ce territoire, mais ce n&apos;est 
                pas obligatoire si vous êtes mobile et motivé !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ensemble, créons du lien et de la solidarité
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Rejoignez une communauté engagée et bienveillante
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:aafd@gmx.fr?subject=Devenir bénévole AAFD"
              className="inline-block rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Devenir bénévole
            </a>
            <Link
              href="/notre-action"
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
