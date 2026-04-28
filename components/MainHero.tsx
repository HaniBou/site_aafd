'use client'

import Image from 'next/image'
import Link from 'next/link'

export function MainHero() {
  return (
    <section className="relative h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_accueil.webp"
          alt="AAFD - Accompagnement des familles"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#152a45]/95 via-[#1e3a5f]/85 to-[#1e3a5f]/70" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 z-[1] opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Desktop CTA buttons - refined rounded style */}
      <div className="hidden lg:flex absolute bottom-10 right-12 z-20 items-center gap-4">
        <Link 
          href="/nous-rejoindre" 
          className="group flex items-center gap-3 px-6 py-4 bg-[#e67e22] text-white rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#d35400] hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Devenir bénévole
        </Link>

        <a
          href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-6 py-4 bg-white text-[#1e3a5f] rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#fdf3e8] hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 text-[#e67e22]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          Faire un don
        </a>
      </div>

      {/* Contenu central */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-4 animate-fadeIn">
          Depuis 17 ans sur le Val de Saône
        </p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          Association d&apos;Aide aux Familles en Difficulté
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          Accompagner, soutenir et créer du lien avec les familles réfugiées
        </p>
        
        {/* Scroll indicator */}
        <div className="hidden md:flex flex-col items-center mt-10 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <span className="text-white/60 text-xs uppercase tracking-widest mb-2">Découvrir</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
        
        {/* Mobile CTA buttons */}
        <div className="flex lg:hidden flex-wrap gap-3 justify-center mt-8">
          <Link
            href="/nous-rejoindre"
            className="px-5 py-3 text-sm font-semibold rounded-xl bg-[#e67e22] text-white hover:bg-[#d35400] transition-all shadow-lg"
          >
            Devenir bénévole
          </Link>
          <a
            href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-white/95 text-[#1e3a5f] hover:bg-white transition-all shadow-lg"
          >
            <svg className="w-4 h-4 text-[#e67e22]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Faire un don
          </a>
        </div>
      </div>
    </section>
  )
}
