import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nous soutenir - AAFD Val de Saône',
  description: 'Soutenez l\'AAFD : faites un don, devenez partenaire ou participez à nos événements',
}

export default function NousSoutenirPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 to-green-600 py-20 md:py-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Nous soutenir
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Votre soutien est essentiel pour continuer à accompagner les familles en difficulté 
              et développer nos actions sur le Val de Saône.
            </p>
          </div>
        </div>
      </section>

      {/* Pourquoi nous soutenir */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Pourquoi nous soutenir ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Votre contribution permet de financer des actions concrètes et essentielles
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-start gap-4 p-6 border-l-4 border-blue-900 bg-white shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aide au logement</h3>
                <p className="text-gray-600">
                  Financement de cautions, loyers, et frais d&apos;agence pour permettre aux familles 
                  d&apos;accéder à un logement décent.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 border-l-4 border-orange-600 bg-white shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Frais juridiques</h3>
                <p className="text-gray-600">
                  Prise en charge des honoraires d&apos;avocats et frais de justice pour défendre 
                  les droits des familles réfugiées.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 border-l-4 border-green-700 bg-white shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Besoins quotidiens</h3>
                <p className="text-gray-600">
                  Aide pour les transports, assurances, équipements de première nécessité, 
                  et frais de scolarité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment nous soutenir */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Comment nous soutenir ?
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Faire un don */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 mb-4">
                  <svg className="h-10 w-10 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Faire un don
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre don financier nous permet de répondre rapidement aux besoins urgents 
                  des familles et de maintenir nos actions tout au long de l&apos;année.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    <strong>Déduction fiscale :</strong> 66% de réduction d&apos;impôt sur le revenu
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    <strong>Reçu fiscal :</strong> Délivré pour tous les dons
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    <strong>Don ponctuel ou régulier :</strong> Choisissez la formule qui vous convient
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-sm text-blue-900 font-semibold mb-2">Contact pour les dons</p>
                <p className="text-blue-800">
                  <strong>Email :</strong> aafd@gmx.fr
                </p>
              </div>
            </div>

            {/* Participer aux événements */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center rounded-full bg-orange-100 p-3 mb-4">
                  <svg className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Participer à nos événements
                </h3>
                <p className="text-gray-600 mb-6">
                  En participant à nos ventes de plats, tournoi de pétanque ou actions citoyennes, 
                  vous soutenez financièrement l&apos;association tout en créant du lien.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🍽️ Ventes de plats mensuelles</h4>
                  <p className="text-sm text-gray-600">
                    Commandez des plats traditionnels cuisinés par les familles
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Tournoi de pétanque annuel</h4>
                  <p className="text-sm text-gray-600">
                    Inscrivez votre équipe et participez à cette journée festive
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🌍 Actions environnementales</h4>
                  <p className="text-sm text-gray-600">
                    Rejoignez-nous pour nettoyer notre Val de Saône
                  </p>
                </div>
              </div>

              <Link
                href="/notre-action"
                className="block w-full text-center rounded-full bg-orange-600 px-6 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors"
              >
                Découvrir nos événements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Devenir partenaire */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Entreprises & collectivités
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Vous êtes une <strong>entreprise</strong> ou une <strong>collectivité</strong> et souhaitez 
                  vous engager à nos côtés ? Plusieurs formes de partenariat sont possibles.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Mécénat financier</strong> : soutenez nos actions par un don déductible à 60%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Mécénat de compétences</strong> : mettez vos expertises à notre service</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Parrainage d&apos;événements</strong> : associez votre image à nos actions</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-blue-100">
              <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                <svg className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact de votre soutien */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              L&apos;impact de votre soutien
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Grâce à votre générosité, nous pouvons accomplir des actions concrètes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="mb-4 text-4xl font-bold text-orange-400">30€</div>
              <p className="text-lg text-blue-100">
                = 1 mois d&apos;assurance habitation pour une famille
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="mb-4 text-4xl font-bold text-orange-400">100€</div>
              <p className="text-lg text-blue-100">
                = Transport et frais pour 1 rendez-vous juridique
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="mb-4 text-4xl font-bold text-orange-400">500€</div>
              <p className="text-lg text-blue-100">
                = Aide au paiement d&apos;une caution pour un logement
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-blue-100 text-lg">
              <strong>Chaque don compte</strong> et fait une réelle différence dans la vie des familles que nous accompagnons.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Prêt à nous soutenir ?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Contactez-nous pour échanger sur les différentes formes de soutien possibles
          </p>
          <div className="bg-gray-50 p-8 rounded-2xl max-w-2xl mx-auto">
            <p className="text-lg mb-4 text-gray-900">
              <strong>Association d&apos;Aide aux Familles en Difficulté</strong>
            </p>
            <p className="text-gray-600 mb-2">
              📧 Email : <a href="mailto:aafd@gmx.fr" className="text-blue-900 hover:text-blue-700 font-semibold">aafd@gmx.fr</a>
            </p>
            <p className="text-gray-600">
              📱 Instagram : <a href="https://www.instagram.com/aafd_asso/" target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 font-semibold">@aafd_asso</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
