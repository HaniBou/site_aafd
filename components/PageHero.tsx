import Image from 'next/image'

interface PageHeroProps {
  title: string
  description: string
  imageSrc: string
  imageAlt?: string
  gradientFrom?: string
  gradientTo?: string
}

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  gradientFrom = 'from-blue-900/90',
  gradientTo = 'to-blue-800/70',
}: PageHeroProps) {
  return (
    <section className="relative h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-5xl text-white drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-lg text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
          {description}
        </p>
      </div>
    </section>
  )
}
