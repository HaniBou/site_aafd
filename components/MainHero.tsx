import Image from 'next/image'
import { ASSOCIATION_FOUNDING_YEAR, HELLOASSO_URL } from '@/lib/siteConfig'
import { Button } from '@/components/ui/Button'

export function MainHero() {
  return (
    <section className="relative h-[100svh] flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_accueil.webp"
          alt="AAFD - Accompagnement des familles"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
      </div>

      <div className="relative z-20 pb-16 md:pb-24">
        <div className="mx-auto max-w-screen-2xl px-8 md:px-16">
          <div className="w-16 h-0.5 bg-orange-700 mb-6 animate-hero-line" />

          <h1
            className="font-bold text-white leading-tight tracking-tight mb-8 drop-shadow-2xl"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Association d&apos;Aide aux Familles
            <span className="block text-orange-400 italic font-normal">en Difficulté.</span>
          </h1>

          <div className="flex items-start gap-6 max-w-lg mb-10 animate-hero-fade">
            <div className="w-px h-14 bg-orange-700/50 shrink-0 mt-1" />
            <p className="text-white text-base md:text-lg leading-relaxed drop-shadow-lg">
              Accompagner, soutenir et créer du lien avec les{' '}
              <span className="text-white font-semibold">familles réfugiées</span>{' '}
              depuis {ASSOCIATION_FOUNDING_YEAR}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-hero-fade-late">
            <Button href="/nous-rejoindre" variant="primary" size="md">
              Devenir bénévole
            </Button>
            <Button
              href={HELLOASSO_URL}
              variant="donate"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Faire un don
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 right-10 z-30 flex flex-col items-center gap-3 animate-scroll-hint"
        aria-hidden="true"
      >
        <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        <svg width="20" height="10" viewBox="0 0 14 8" fill="none">
          <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
