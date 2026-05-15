import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Nous soutenir - AAFD Val de Saône',
  description: 'Soutenez l\'AAFD : faites un don, devenez partenaire ou participez à nos événements',
}

export default function NousSoutenirPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Nous soutenir"
        description="Votre soutien est essentiel pour continuer à accompagner les familles en difficulté et développer nos actions sur le Val de Saône."
        imageSrc="/images/donate.webp"
        imageAlt="Nous soutenir"
        accentColor="bg-green-400"
      />

      {/* Pourquoi nous soutenir : Style Épuré */}
<section className="py-20 bg-white">
  <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Votre impact concret</h2>
      <div className="w-12 h-1 bg-blue-900 mx-auto"></div>
    </div>

    <div className="grid md:grid-cols-3 gap-12">
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold text-blue-900 mb-4 tracking-tight">Aide au logement</h3>
        <p className="text-gray-600 leading-relaxed font-light">
          Financement de cautions et loyers pour permettre aux familles d'accéder à un foyer décent.
        </p>
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold text-orange-600 mb-4 tracking-tight">Frais juridiques</h3>
        <p className="text-gray-600 leading-relaxed font-light">
          Prise en charge des honoraires pour défendre les droits fondamentaux des familles réfugiées.
        </p>
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold text-green-700 mb-4 tracking-tight">Besoins quotidiens</h3>
        <p className="text-gray-600 leading-relaxed font-light">
          Soutien pour les transports, les assurances et l'équipement de première nécessité.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Comment nous soutenir */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900">
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
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
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

     {/* Section Impact : L'AAFD en chiffres (Style harmonisé) */}
<section className="bg-blue-900 py-16 md:py-24 text-white">
  <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-white">
        L&apos;impact de votre soutien
      </h2>
    </div>

    <div className="grid gap-12 md:grid-cols-3">
      {/* Palier 1 */}
      <div className="text-center">
        <div className="mb-2 text-5xl font-bold text-orange-400">30€</div>
        <div className="text-lg text-blue-100 ">
          = 1 mois d&apos;assurance habitation pour une famille
        </div>
      </div>

      {/* Palier 2 */}
      <div className="text-center">
        <div className="mb-2 text-5xl font-bold text-orange-400">100€</div>
        <div className="text-lg text-blue-100 ">
          = Frais pour un dossier de recours juridique
        </div>
      </div>

      {/* Palier 3 */}
      <div className="text-center">
        <div className="mb-2 text-5xl font-bold text-orange-400">500€</div>
        <div className="text-lg text-blue-100">
          = Aide au paiement d&apos;une caution pour un logement
        </div>
      </div>
    </div>
  </div>
</section>

     {/* CTA */}
<section className="py-16 md:py-20">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-gray-900">
      Prêt à agir à nos côtés ?
    </h2>
    <p className="mb-8 text-body-large text-gray-600">
      Que ce soit par un don ou en donnant de votre temps, votre soutien est précieux.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-full bg-blue-900 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-800 transition-colors"
      >
        Faire un don
      </Link>
      <Link
        href="/nous-rejoindre"
        className="inline-block rounded-full border-2 border-blue-900 px-8 py-4 text-lg font-semibold text-blue-900 hover:bg-blue-900 hover:text-white transition-colors"
      >
        Nous rejoindre
      </Link>
    </div>
  </div>
</section>
    </main>
  )
}
