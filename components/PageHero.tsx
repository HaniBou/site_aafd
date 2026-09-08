import Image from 'next/image'

interface PageHeroProps {
  title: string
  description: string
  imageSrc: string
  imageAlt?: string
  accentColor?: string
  titleTag?: 'h1' | 'p'
}

// Heros des pages interieures : bandeau photo panoramique, puis un chapeau
// editorial sur deux colonnes. La structure differe de l'accueil (compose en
// deux colonnes texte/photo), le vocabulaire reste le meme : carte arrondie,
// accents au palier 700, texte sur blanc. Aucun texte n'est pose sur la photo.
export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  accentColor = 'bg-blue-700',
  titleTag = 'h1',
}: PageHeroProps) {
  const Title = titleTag

  return (
    <section className="pt-24 lg:pt-28">
      <div className="relative mx-5 h-[30svh] min-h-[220px] overflow-hidden rounded-3xl md:h-[38svh] lg:mx-6">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div className="px-8 py-10 md:px-16 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <div className={`w-16 h-1 rounded-full ${accentColor} mb-6 animate-hero-line`} />

            <Title
              className="font-bold text-blue-900 leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
            >
              {title}
            </Title>
          </div>

          <div className="flex items-start gap-6 animate-hero-fade lg:pb-2">
            <div className={`w-px h-14 ${accentColor} opacity-40 shrink-0 mt-1`} />
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
