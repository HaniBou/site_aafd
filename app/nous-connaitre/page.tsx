import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Nous connaître - AAFD Val de Saône',
  description: 'Découvrez l\'histoire et la mission de l\'AAFD, association d\'aide aux familles en difficulté sur le Val de Saône',
}

export default function NousConnaitrePage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Nous connaître"
        description="L'AAFD accompagne depuis 17 ans des familles réfugiées et des jeunes isolés sur le Val de Saône dans leurs difficultés matérielles et administratives."
        imageSrc="/images/hero_nous_connaitre.webp"
        imageAlt="Nous connaître"
      />

      {/* Notre histoire */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-gray-900">
                Notre histoire
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                <p>
                  Depuis <strong>17 ans maintenant</strong>, l&apos;Association d&apos;Aide aux Familles en Difficulté 
                  œuvre sur le territoire du Val de Saône pour accompagner les personnes en situation de précarité.
                </p>
                <p>
                  Nous aidons des familles originaires d&apos;<strong>Albanie, du Kosovo, de Bosnie, d&apos;Arménie, 
                  d&apos;Algérie, de Guinée, de République Démocratique du Congo</strong> et d&apos;autres pays.
                </p>
                <p>
                  Nos bénévoles accompagnent également des <strong>jeunes isolés</strong> localisés sur le Val de Saône 
                  dans les difficultés matérielles ou administratives qu&apos;ils rencontrent au quotidien.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl bg-blue-100">
              <Image 
                src="/images/distribution.webp" 
                alt="Notre histoire AAFD"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notre mission */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900">
              Notre mission
            </h2>
            <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
              Nous organisons tout au long de l&apos;année des événements pour atteindre trois objectifs complémentaires
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-4">
                <svg className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-gray-900">
                Sensibiliser
              </h3>
              <p className="text-gray-600">
                Sensibiliser sur la question de l&apos;immigration et comprendre les raisons de l&apos;exil
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange-100 p-4">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900">
                Créer des liens
              </h3>
              <p className="text-gray-600">
                Créer des liens amicaux et festifs entre la population locale et les familles réfugiées
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-4">
                <svg className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900">
                Récolter des fonds
              </h3>
              <p className="text-gray-600">
                Récolter des fonds pour développer l&apos;aide matérielle : transports, assurances, avocats, hébergement...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl bg-orange-100">
              <Image
                src="/images/ensemble.webp"
                alt="Nos valeurs"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-gray-900">
                Nos valeurs
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      ✓
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-900">Solidarité</h3>
                    <p className="text-gray-600">
                      Nous croyons en l&apos;importance de l&apos;entraide et du soutien mutuel pour construire une société plus juste.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      ✓
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-900">Respect</h3>
                    <p className="text-gray-600">
                      Chaque personne est unique et mérite d&apos;être traitée avec dignité, quelles que soient ses origines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                      ✓
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-900">Participation</h3>
                    <p className="text-gray-600">
                      Les jeunes et les familles sont associés et participent activement aux événements de l&apos;association.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>
              L&apos;AAFD en chiffres
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-400">17</div>
              <div className="text-lg text-blue-100">années d&apos;expérience</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-400">150</div>
              <div className="text-lg text-blue-100">repas vendus par mois</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-400">10+</div>
              <div className="text-lg text-blue-100">nationalités accompagnées</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-400">100%</div>
              <div className="text-lg text-blue-100">bénévoles</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900">
            Envie d&apos;en savoir plus ?
          </h2>
          <p className="mb-8 text-body-large text-gray-600">
            Découvrez nos actions concrètes ou rejoignez notre communauté de bénévoles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/notre-action"
              className="inline-block rounded-full bg-blue-900 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              Nos actions
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
