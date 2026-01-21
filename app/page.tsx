"use client";

import Link from 'next/link'
import Image from 'next/image'
import { MainHero } from '@/components/MainHero'
import { useEffect, useState } from 'react'
import getActualites from '@/lib/getActualites'
import { getCategoryStyles } from '@/lib/categoryStyles'

interface Actualite {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

export default function HomePage() {
  const [latestActualite, setLatestActualite] = useState<Actualite | null>(null);

  useEffect(() => {
    async function fetchLatestActualite() {
      try {
        const actualites = await getActualites();
        if (actualites.length > 0) {
          // Trier par date décroissante et prendre la plus récente
          const sorted = actualites.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setLatestActualite(sorted[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'actualité:", error);
      }
    }
    fetchLatestActualite();
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section simple */}
      <MainHero />

      {/* Actualité à la une */}
      {latestActualite && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-medium tracking-wide rounded-full">
                  À la une
                </span>
              </div>
              <Link
                href="/actualites"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors hidden sm:inline-flex items-center gap-1"
              >
                Voir toutes les actualités
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Image */}
              <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {latestActualite.image && latestActualite.image !== 'none' ? (
                  <Image
                    src={latestActualite.image}
                    alt={latestActualite.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <svg className="h-24 w-24 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                )}
              </div>
              
              {/* Contenu */}
              <div className="p-6 md:p-8">
                <span className={`inline-block px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-full ${getCategoryStyles(latestActualite.category)}`}>
                  {latestActualite.category}
                </span>
                <h3 className="large text-gray-900 mt-3">
                  {latestActualite.title}
                </h3>
                <p className="text-small text-gray-500">
                  {new Date(latestActualite.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600">
                  {truncateText(latestActualite.content, 200)}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/actualites/${latestActualite.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                  >
                    Lire la suite
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {latestActualite.category === "Vente de plats" && (
                    <Link
                      href="/vente-plats"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                      Commander
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ce qui nous anime */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900">
              Ce qui nous anime
            </h2>
            <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
              Accompagner, soutenir et créer du lien avec les familles réfugiées
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Objectif 1 */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="relative h-80 w-full">
                <Image 
                  src="/images/help.webp" // Remplace par ton image
                  alt="Sensibiliser"
                  fill
                  className="object-cover"
                  
                />
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-gray-900">
                  Sensibiliser
                </h3>
                <p className="text-gray-600">
                  Sensibiliser sur la question de l&apos;immigration et comprendre les raisons de l&apos;exil
                </p>
              </div>
            </div>

            {/* Objectif 2 */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-orange-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="relative h-80 w-full">
                <Image 
                  src="/images/v5.webp" // Remplace par ton image
                  alt="Créer du lien"
                  fill
                  className="object-cover"
                  
                />
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-gray-900">
                  Créer du lien
                </h3>
                <p className="text-gray-600">
                  Créer des liens amicaux et festifs entre la population locale et les familles réfugiées
                </p>
              </div>
            </div>

            {/* Objectif 3 */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-green-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="relative h-80 w-full">
                <Image 
                  src="/images/donate.webp" 
                  alt="Récolter des fonds"
                  fill
                  className="object-cover"
                  
                />
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-gray-900">
                  Récolter des fonds
                </h3>
                <p className="text-gray-600">
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
              <h2 className="text-gray-900">
                Qui aidons-nous ?
              </h2>
              <div className="prose prose-xl text-gray-600 text-justify">
                <p className="text-gray-600">
                  Nous accompagnons des <strong>familles réfugiées</strong> originaires d&apos;Albanie, du Kosovo, 
                  de Bosnie, d&apos;Arménie, d&apos;Algérie, de Guinée, de République Démocratique du Congo et d&apos;autres pays.
                </p>
                <p className="text-gray-600">
                  Nous soutenons également des <strong>jeunes isolés</strong> localisés sur le Val de Saône 
                  dans les difficultés matérielles ou administratives qu&apos;ils rencontrent.
                </p>
                <p className="text-gray-600">
                  Les jeunes et les familles sont <strong>associés et participent</strong> activement à nos événements.
                </p>
              </div>
              <Link
                href="/notre-action"
                className="mt-6 inline-flex items-center gap-2 text-lg text-blue-900 font-semibold hover:underline"
              >
                Découvrir notre action en détail
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative h-[400px] rounded overflow-hidden shadow-xl bg-gray-200">
              <Image 
                src="/images/v4.webp" // Remplace par ton image
                alt="Qui aidons-nous"
                fill
                className="object-cover"
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nos événements */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900">
              Nos événements
            </h2>
            <p className="text-body-large text-gray-600">
              Tout au long de l&apos;année, nous organisons des événements conviviaux
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Vente de plats */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] w-full">
                <Image 
                  src="/images/plats.webp" // Remplace par ton image
                  alt="Vente de plats"
                  fill
                  className="object-cover"
                  
                />
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-gray-900">
                  Ventes de plats traditionnels
                </h3>
                <p className="text-gray-600">
                  Les familles cuisinent des plats de leurs pays. 140 à 150 menus vendus chaque mois !
                </p>
              </div>
            </div>

            {/* Événements festifs */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] w-full">
                <Image 
                  src="/images/petanque.webp" // Remplace par ton image
                  alt="Événements festifs"
                  fill
                  className="object-cover"
                  
                />
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-gray-900">
                  Événements festifs
                </h3>
                <p className="text-gray-600">
                  Tout au long de l&apos;année, nous organisons des moments conviviaux pour créer du lien et sensibiliser.
                </p>
              </div>
            </div>

            {/* Nettoyage */}
            <div className="group rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] w-full ">
                <Image 
                  src="/images/nettoyons.webp" // Remplace par ton image
                  alt="Nettoyage Val de Saône"
                  fill
                  className="object-cover object-bottom"
                  
                />
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-gray-900">
                  Nettoyons notre Val de Saône
                </h3>
                <p className="text-gray-600">
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
          <h2>
            Rejoignez notre communauté
          </h2>
          <p className="mb-8 text-body-large text-blue-100">
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
