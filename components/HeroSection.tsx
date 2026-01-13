import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface HeroSectionProps {
  title: string
  subtitle?: string
  backgroundImage?: any
  ctaText?: string
  ctaLink?: string
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(backgroundImage).width(1920).url()}
            alt={backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60" />
        </div>
      )}

      {/* Contenu */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mb-8 text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-900 hover:bg-blue-50 transition-colors shadow-lg"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  )
}
