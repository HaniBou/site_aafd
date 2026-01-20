'use client'

import Image from 'next/image'
import Link from 'next/link'

export function MainHero() {
  return (
    <section className="relative h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_accueil.webp"
          alt="AAFD - Accompagnement des familles"
          fill
          className="object-cover"
          priority
          
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
      </div>

      {/* Boutons Blob flottants - Desktop uniquement - En bas à droite */}
      <div className="hidden lg:flex absolute bottom-8 right-12 z-20 items-center">
        {/* Bouton Devenir Bénévole - Blob Orange */}
        <Link href="/nous-rejoindre" className="relative inline-block group">
          {/* Blob Orange de fond (décalé) */}
          <div 
            className="absolute inset-0 bg-orange-300 opacity-40 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
            style={{
              borderRadius: "20% 80% 70% 30% / 30% 40% 70% 60%",
              transform: "translate(6px, 6px)"
            }}
          ></div>

          {/* Blob Orange principal */}
          <div 
            className="relative px-8 py-6 w-36 h-36 flex flex-col items-center justify-center text-white font-bold text-center text-sm uppercase tracking-wide leading-tight transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #fb923c, #f97316)",
              borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            }}
          >
            Devenir<br />Bénévole
            <svg className="w-6 h-6 mt-1" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </Link>

        {/* Bouton Faire un Don - Blob Rose (superposé) */}
        <a
          href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block group -ml-8 z-30"
        >
          {/* Blob Rose de fond (décalé) */}
          <div 
            className="absolute inset-0 bg-pink-300 opacity-40 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
            style={{
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              transform: "translate(6px, 6px)"
            }}
          ></div>

          {/* Blob Rose principal */}
          <div 
            className="relative px-8 py-6 w-36 h-36 flex flex-col items-center justify-center text-white font-bold text-center text-sm uppercase tracking-wide leading-tight transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #ec4899, #db2777)",
              borderRadius: "50% 50% 40% 60% / 50% 60% 40% 50%",
            }}
          >
            Faire<br />un Don
            <svg className="w-6 h-6 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </a>
      </div>

      {/* Contenu central */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl drop-shadow-2xl">
          Association d&apos;Aide aux Familles en Difficulté
        </h1>
        <p className="text-lg text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
          Accompagner, soutenir et créer du lien avec les familles réfugiées depuis 17 ans
        </p>
        
        {/* Boutons CTA Mobile uniquement */}
        <div className="flex lg:hidden flex-wrap gap-4 justify-center mt-8">
          <Link
            href="/nous-rejoindre"
            className="px-6 py-3 text-base font-bold rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Devenir bénévole
          </Link>
          <a
            href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Faire un don
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button 
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer hover:scale-110 transition-transform"
        aria-label="Défiler vers le bas"
      >
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>
    </section>
  )
}
