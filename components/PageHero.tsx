'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface PageHeroProps {
  title: string
  description: string
  imageSrc: string
  imageAlt?: string
  accentColor?: string
}

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  accentColor = 'bg-blue-400',
}: PageHeroProps) {
  return (
    <section className="relative h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 pb-12 md:pb-16">
        <div className="mx-auto max-w-screen-2xl px-8 md:px-16">

          {/* Ligne décorative */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`w-12 h-0.5 ${accentColor} mb-5`}
            style={{ originX: 0 }}
          />

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-bold text-white leading-tight tracking-tight mb-6 drop-shadow-2xl"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            {title}
          </motion.h1>

          {/* Barre verticale + description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex items-start gap-5 max-w-xl"
          >
            <div className={`w-px h-12 ${accentColor} opacity-60 shrink-0 mt-1`} />
            <p className="text-white/80 text-base md:text-lg leading-relaxed drop-shadow-lg">
              {description}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
