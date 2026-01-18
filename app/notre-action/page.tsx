import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Notre action - AAFD Val de Saône',
  description: 'Découvrez les actions concrètes de l\'AAFD : ventes de plats, tournoi de pétanque, actions environnementales',
}

export default function NotreActionPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Notre action"
        description="Des événements tout au long de l'année pour créer du lien, sensibiliser et récolter des fonds au profit des familles en difficulté."
        imageSrc="/images/hero_notre_action.webp"
        imageAlt="Notre action"
        gradientFrom="from-orange-900/90"
        gradientTo="to-orange-800/70"
      />

      {/* Ventes de plats */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Ventes de plats traditionnels
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Chaque mois, nous organisons des <strong>ventes de plats traditionnels</strong> cuisinés 
                  par les familles que nous accompagnons.
                </p>
                <p>
                  Une occasion de découvrir les saveurs d&apos;<strong>Albanie, du Kosovo, de Bosnie, d&apos;Arménie, 
                  d&apos;Algérie, de Guinée</strong> et d&apos;autres pays, tout en soutenant concrètement nos actions.
                </p>
                <p>
                  Ces repas sont l&apos;occasion de partager un moment convivial et de créer des liens 
                  entre les habitants du Val de Saône et les familles réfugiées.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg mt-6">
                  <p className="text-blue-900 font-semibold mb-2">💡 Le saviez-vous ?</p>
                  <p className="text-blue-800">
                    Nous vendons plus de 150 repas par mois grâce à la mobilisation de nos bénévoles 
                    et à la générosité des familles qui cuisinent avec passion.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl">
              <img
                src="/images/plats.webp"
                alt="Ventes de plats traditionnels"
                className="object-cover w-full h-full"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tournoi de pétanque */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl bg-blue-100 order-2 md:order-1">
              <img
                src="/images/evenement.webp"
                alt="Tournoi de pétanque"
                className="object-cover w-full h-full"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Événements festifs et sportifs
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Tout au long de l&apos;année, nous organisons des <strong>événements conviviaux</strong> qui 
                  rassemblent habitants du Val de Saône, familles réfugiées et sympathisants.
                </p>
                <p>
                  Ces moments festifs permettent de créer du lien, de sensibiliser le grand public à la question 
                  de l&apos;immigration dans une ambiance chaleureuse et amicale.
                </p>
                <p>
                  Les fonds récoltés lors de ces événements sont intégralement reversés pour financer 
                  l&apos;aide matérielle aux familles : transports, assurances, frais d&apos;avocats, hébergement...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nettoyons notre Val de Saône */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Nettoyons notre Val de Saône
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Au-delà de l&apos;aide aux familles, nous sommes engagés pour notre territoire et 
                  l&apos;environnement à travers des <strong>actions de nettoyage</strong> participatives.
                </p>
                <p>
                  Ces journées citoyennes permettent de rassembler habitants et familles accompagnées 
                  autour d&apos;un projet commun : <strong>préserver notre cadre de vie</strong>.
                </p>
                <p>
                  C&apos;est aussi une occasion de montrer que les familles réfugiées sont actrices 
                  du territoire et souhaitent contribuer positivement à la vie locale.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl bg-green-100">
              <img
                src="/images/nettoyons_1.webp"
                alt="Nettoyage Val de Saône"
                className="object-cover w-full h-full object-bottom"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Autres actions */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Nos autres actions
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              L&apos;AAFD agit au quotidien pour accompagner les familles en difficulté
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-1">
              <div className="flex items-center gap-4 p-5 hover:bg-white/20 transition-colors">
                <svg className="h-10 w-10 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Accompagnement administratif</h3>
                  <p className="text-blue-100">
                    Aide aux démarches administratives, traduction de documents, accompagnement aux rendez-vous officiels.
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/20"></div>

              <div className="flex items-center gap-4 p-5 hover:bg-white/20 transition-colors">
                <svg className="h-10 w-10 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Aide au logement</h3>
                  <p className="text-blue-100">
                    Recherche de logements, médiation avec les propriétaires, aide au financement des cautions et loyers.
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/20"></div>

              <div className="flex items-center gap-4 p-5 hover:bg-white/20 transition-colors">
                <svg className="h-10 w-10 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Cours de français</h3>
                  <p className="text-blue-100">
                    Organisation de cours de français pour faciliter l&apos;intégration et l&apos;autonomie des familles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Notre impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Grâce à la mobilisation de nos bénévoles et au soutien de nos partenaires
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-blue-900">50+</div>
              <div className="text-gray-700">familles accompagnées</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-orange-600">12</div>
              <div className="text-gray-700">événements par an</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-green-700">1800+</div>
              <div className="text-gray-700">repas vendus par an</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-purple-700">100%</div>
              <div className="text-gray-700">engagement bénévole</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Envie de participer ?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Rejoignez-nous lors de nos prochains événements ou soutenez nos actions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nous-soutenir"
              className="inline-block rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Nous soutenir
            </Link>
            <Link
              href="/nous-rejoindre"
              className="inline-block rounded-full border-2 border-orange-600 px-8 py-4 text-lg font-semibold text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
            >
              Devenir bénévole
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
