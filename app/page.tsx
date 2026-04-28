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
  date: string; // date de l'événement
  uploadedAt: string; // date/heure d'upload
  category: string;
  image: string;
  content: string;
  aLaUne: boolean;
}

export default function HomePage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [featuredActu, setFeaturedActu] = useState<Actualite | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActualites();
        if (data.length > 0) {
          setActualites(data);

          // 1. LOGIQUE "À LA UNE"
          // On cherche l'actu cochée dans l'admin
          let aLaUne = data.find(actu => actu.aLaUne === true);
          
          // Si rien n'est coché, on prend la plus récente par date
          if (!aLaUne) {
            aLaUne = [...data].sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
          }
          setFeaturedActu(aLaUne);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }
    fetchData();
  }, []);

  // --- LOGIQUE POUR L'AGENDA (Événements futurs uniquement) ---
  const evenementsAgenda = actualites
    .filter(actu => {
      const isEventCategory = actu.category === "Vente de plats" || actu.category === "Événement à venir";
      const eventDate = new Date(actu.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // On compare uniquement le jour
      
      return isEventCategory && eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Plus proche en premier
    .slice(0, 2);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <main className="min-h-screen bg-white">
      <MainHero />

      {/* Actualité à la une */}
      {featuredActu && (
        <section className="py-16 md:py-20 bg-[#f5f3f0]">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#e67e22] rounded-full" />
                <span className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wider">
                  À la une
                </span>
              </div>
              <Link
                href="/actualites"
                className="group text-[#1e3a5f] font-medium text-sm transition-colors hidden sm:inline-flex items-center gap-2 hover:text-[#e67e22]"
              >
                Voir toutes les actualités
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-0 items-stretch bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
              {/* Image */}
              <div className="relative h-[280px] md:h-full min-h-[350px] bg-[#1e3a5f] flex items-center justify-center">
                {featuredActu.image && featuredActu.image !== 'none' ? (
                  <Image
                    src={featuredActu.image}
                    alt={featuredActu.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <svg className="h-20 w-20 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                )}
              </div>
              
              {/* Contenu */}
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <span className={`inline-block w-fit px-3 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-md ${getCategoryStyles(featuredActu.category)}`}>
                  {featuredActu.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-4 leading-tight">
                  {featuredActu.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  {new Date(featuredActu.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {truncateText(featuredActu.content, 180)}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <Link
                    href={`/actualites/${featuredActu.id}`}
                    className="group inline-flex items-center gap-2 text-[#1e3a5f] font-semibold text-sm transition-colors hover:text-[#e67e22]"
                  >
                    Lire la suite
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  {featuredActu.category === "Vente de plats" && (
                    <Link
                      href="/vente-plats"
                      className="inline-flex items-center gap-2 bg-[#e67e22] text-white px-5 py-2.5 rounded-lg hover:bg-[#d35400] transition-all font-semibold text-sm"
                    >
                      Commander
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-3">Notre mission</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              Ce qui nous anime
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4">
              Accompagner, soutenir et créer du lien avec les familles réfugiées
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Objectif 1 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 card-hover">
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src="/images/help.webp" 
                  alt="Sensibiliser"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/95 text-[#1e3a5f]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                  Sensibiliser
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sensibiliser sur la question de l&apos;immigration et comprendre les raisons de l&apos;exil
                </p>
              </div>
            </div>

            {/* Objectif 2 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 card-hover">
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src="/images/v5.webp" 
                  alt="Créer du lien"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/95 text-[#1e3a5f]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                  Créer du lien
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Créer des liens amicaux et festifs entre la population locale et les familles réfugiées
                </p>
              </div>
            </div>

            {/* Objectif 3 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 card-hover">
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src="/images/donate.webp" 
                  alt="Récolter des fonds"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/95 text-[#1e3a5f]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                  Récolter des fonds
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Développer l&apos;aide matérielle : transports, assurances, avocats, hébergement...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qui aidons-nous */}
      <section className="bg-[#f5f3f0] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:gap-16 md:grid-cols-2 items-center">
            <div>
              <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-3">Notre engagement</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6">
                Qui aidons-nous ?
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Nous accompagnons des <strong className="text-[#1e3a5f]">familles réfugiées</strong> originaires d&apos;Albanie, du Kosovo, 
                  de Bosnie, d&apos;Arménie, d&apos;Algérie, de Guinée, de République Démocratique du Congo et d&apos;autres pays.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Nous soutenons également des <strong className="text-[#1e3a5f]">jeunes isolés</strong> localisés sur le Val de Saône 
                  dans les difficultés matérielles ou administratives qu&apos;ils rencontrent.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Les jeunes et les familles sont <strong className="text-[#1e3a5f]">associés et participent</strong> activement à nos événements.
                </p>
              </div>
              <Link
                href="/notre-action"
                className="group mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#152a45] transition-all"
              >
                Découvrir notre action
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/images/v4.webp" 
                alt="Qui aidons-nous"
                fill
                className="object-cover"
              />
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#e67e22]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

{/* 3. AGENDA - Cette section ne s'affiche QUE s'il y a des événements */}
{evenementsAgenda.length > 0 && (
  <section className="py-20 md:py-24 bg-[#1e3a5f]">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      
      {/* En-tête de section */}
      <div className="text-center mb-12">
        <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-3">Agenda</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Prochains rendez-vous</h2>
      </div>

      {/* Grille d'événements */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {evenementsAgenda.map((evt) => (
          <Link 
            key={evt.id} 
            href={`/actualites/${evt.id}`} 
            className="group bg-white/5 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-white/10 flex items-center gap-5 transition-all hover:bg-white/10 hover:border-white/20"
          >
            {/* Date box */}
            <div className="bg-[#e67e22] text-white w-16 h-16 md:w-20 md:h-20 rounded-xl flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl md:text-3xl font-bold leading-none">
                {new Date(evt.date).getDate()}
              </span>
              <span className="text-[10px] md:text-xs uppercase font-semibold opacity-90">
                {new Date(evt.date).toLocaleDateString("fr-FR", { month: 'short' }).replace('.', '')}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="text-[#e67e22] text-xs font-semibold uppercase tracking-wider">
                {evt.category}
              </span>
              <h3 className="text-base md:text-lg font-bold text-white mt-1 leading-snug truncate">
                {evt.title}
              </h3>
            </div>

            {/* Arrow */}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#e67e22] transition-colors shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
      {/* Nos événements */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-3">Tout au long de l&apos;année</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              Nos événements
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4">
              Nous organisons des événements conviviaux pour créer du lien
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Vente de plats */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 card-hover">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image 
                  src="/images/plats.webp" 
                  alt="Vente de plats"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                  Ventes de plats traditionnels
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Les familles cuisinent des plats de leurs pays. 140 à 150 menus vendus chaque mois !
                </p>
              </div>
            </div>

            {/* Événements festifs */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 card-hover">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image 
                  src="/images/petanque.webp" 
                  alt="Événements festifs"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                  Événements festifs
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tout au long de l&apos;année, nous organisons des moments conviviaux pour créer du lien.
                </p>
              </div>
            </div>

            {/* Nettoyage */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 card-hover">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image 
                  src="/images/nettoyons.webp" 
                  alt="Nettoyage Val de Saône"
                  fill
                  className="object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                  Nettoyons notre Val de Saône
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Action environnementale avec les familles pour notre environnement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1e3a5f] py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-4">Agissez avec nous</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoignez notre communauté
          </h2>
          <p className="mb-10 text-lg text-white/80 max-w-2xl mx-auto">
            Que vous souhaitiez devenir bénévole, faire un don ou simplement en savoir plus,
            nous serions ravis de vous accueillir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nous-rejoindre"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e67e22] px-8 py-4 text-base font-semibold text-white hover:bg-[#d35400] transition-all"
            >
              Devenir bénévole
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/nous-soutenir"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-[#1e3a5f] transition-all"
            >
              Faire un don
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
