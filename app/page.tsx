import Link from 'next/link'
import Image from 'next/image'
import { HeroWithHeader } from '@/components/HeroWithHeader'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section avec Header intégré */}
      <HeroWithHeader />

      {/* Ce qui nous anime */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              Ce qui nous anime
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Accompagner, soutenir et créer du lien avec les familles réfugiées
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Objectif 1 */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="relative h-80 w-full">
                <Image 
                  src="/images/distribution.jpg" // Remplace par ton image
                  alt="Sensibiliser"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Sensibiliser
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Sensibiliser sur la question de l&apos;immigration et comprendre les raisons de l&apos;exil
                </p>
              </div>
            </div>

            {/* Objectif 2 */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-orange-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="relative h-80 w-full">
                <Image 
                  src="/images/union.jpg" // Remplace par ton image
                  alt="Créer du lien"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Créer du lien
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Créer des liens amicaux et festifs entre la population locale et les familles réfugiées
                </p>
              </div>
            </div>

            {/* Objectif 3 */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-green-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="relative h-80 w-full">
                <Image 
                  src="/images/dons.jpg" // Remplace par ton image
                  alt="Récolter des fonds"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Récolter des fonds
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Développer l&apos;aide matérielle : transports, assurances, avocats, hébergement...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qui aidons-nous */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Qui aidons-nous ?
              </h2>
              <div className="prose prose-xl text-gray-600">
                <p className="mb-4 text-base leading-relaxed">
                  Nous accompagnons des <strong>familles réfugiées</strong> originaires d&apos;Albanie, du Kosovo, 
                  de Bosnie, d&apos;Arménie, d&apos;Algérie, de Guinée, de République Démocratique du Congo et d&apos;autres pays.
                </p>
                <p className="mb-4 text-base leading-relaxed">
                  Nous soutenons également des <strong>jeunes isolés</strong> localisés sur le Val de Saône 
                  dans les difficultés matérielles ou administratives qu&apos;ils rencontrent.
                </p>
                <p className="text-base leading-relaxed">
                  Les jeunes et les familles sont <strong>associés et participent</strong> activement à nos événements.
                </p>
              </div>
              <Link
                href="/notre-action"
                className="mt-6 inline-block text-lg text-blue-900 font-semibold hover:underline"
              >
                Découvrir notre action en détail →
              </Link>
            </div>
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl bg-gray-200">
              <Image 
                src="/images/v4.jpg" // Remplace par ton image
                alt="Qui aidons-nous"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nos événements */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              Nos événements
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tout au long de l&apos;année, nous organisons des événements conviviaux
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Vente de plats */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="relative h-48 w-full">
                <Image 
                  src="/images/plats.jpg" // Remplace par ton image
                  alt="Vente de plats"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Ventes de plats traditionnels
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Les familles cuisinent des plats de leurs pays. 140 à 150 menus vendus chaque mois !
                </p>
              </div>
            </div>

            {/* Événements festifs */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="relative h-48 w-full">
                <Image 
                  src="/images/fete.jpg" // Remplace par ton image
                  alt="Événements festifs"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Événements festifs
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Tout au long de l&apos;année, nous organisons des moments conviviaux pour créer du lien et sensibiliser.
                </p>
              </div>
            </div>

            {/* Nettoyage */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="relative h-48 w-full ">
                <Image 
                  src="/images/dechet.jpg" // Remplace par ton image
                  alt="Nettoyage Val de Saône"
                  fill
                  className="object-cover object-bottom"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Nettoyons notre Val de Saône
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Action environnementale avec les familles pour rendre notre environnement plus agréable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Rejoignez notre communauté
          </h2>
          <p className="mb-8 text-lg text-blue-100 leading-relaxed">
            Que vous souhaitiez devenir bénévole, faire un don ou simplement en savoir plus,
            nous serions ravis de vous accueillir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nous-rejoindre"
              className="inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600 transition-colors shadow-lg"
            >
              Devenir bénévole
            </Link>
            <Link
              href="/nous-soutenir"
              className="inline-block rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              Faire un don
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
