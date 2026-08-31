import Image from 'next/image'

interface PageHeroProps {
  title: string
  description: string
  imageSrc: string
  imageAlt?: string
  accentColor?: string
  /** 'p' quand le vrai titre de la page est ailleurs (page de détail). */
  titleTag?: 'h1' | 'p'
}

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  accentColor = 'bg-blue-400',
  titleTag = 'h1',
}: PageHeroProps) {
  const Title = titleTag

  return (
    <section className="relative h-[60svh] min-h-[400px] md:h-[68svh] flex flex-col justify-end overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        {/* Voile haut : lisibilité de la navigation avant le premier scroll */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 pb-12 md:pb-16">
        <div className="mx-auto max-w-screen-2xl px-8 md:px-16">
          {/* Ligne décorative */}
          <div className={`w-12 h-0.5 ${accentColor} mb-5 animate-hero-line`} />

          {/* Titre — rendu immédiatement, c'est l'élément LCP */}
          <Title
            className="font-bold text-white leading-tight tracking-tight mb-6 drop-shadow-2xl"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            {title}
          </Title>

          {/* Barre verticale + description */}
          <div className="flex items-start gap-5 max-w-xl animate-hero-fade">
            <div className={`w-px h-12 ${accentColor} opacity-60 shrink-0 mt-1`} />
            <p className="text-white text-base md:text-lg leading-relaxed drop-shadow-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
