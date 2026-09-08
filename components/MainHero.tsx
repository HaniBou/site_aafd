import Image from 'next/image'
import { ASSOCIATION_FOUNDING_YEAR, HELLOASSO_URL } from '@/lib/siteConfig'
import { Button } from '@/components/ui/Button'

// Hero scinde : le texte vit sur un panneau clair, la photo occupe sa propre
// colonne. Aucun voile n'est necessaire puisque rien ne se superpose a l'image.
export function MainHero() {
  return (
    <section className="relative grid min-h-[100svh] pt-24 lg:pt-28 lg:grid-cols-2">
      <div className="flex items-center bg-white px-8 pb-12 pt-6 md:px-16 lg:pb-20 lg:pt-0">
        <div className="max-w-xl">
          <div className="w-16 h-1 rounded-full bg-orange-700 mb-6 animate-hero-line" />

          <h1
            className="font-bold text-blue-900 leading-tight tracking-tight mb-8"
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4rem)' }}
          >
            Association d&apos;Aide aux Familles
            <span className="block text-orange-700 italic font-normal">en Difficulté.</span>
          </h1>

          <div className="flex items-start gap-6 max-w-lg mb-10 animate-hero-fade">
            <div className="w-px h-14 bg-orange-700/40 shrink-0 mt-1" />
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Accompagner, soutenir et créer du lien avec les{' '}
              <span className="text-gray-900 font-semibold">familles réfugiées</span>{' '}
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

      <div className="relative mx-5 mb-5 min-h-[42svh] overflow-hidden rounded-3xl lg:mx-6 lg:mb-6 lg:min-h-0">
        <Image
          src="/images/hero_accueil.webp"
          alt="AAFD - Accompagnement des familles"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        <div
          className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-3 animate-scroll-hint"
          aria-hidden="true"
        >
          <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/70 to-transparent" />
          <svg width="20" height="10" viewBox="0 0 14 8" fill="none">
            <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
