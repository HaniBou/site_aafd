'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Distance de defilement au-dela de laquelle la capsule se retracte. Une valeur
// fixe et non une fraction de la fenetre : les heros interieurs ne font plus
// qu'environ 46svh, un seuil proportionnel ne se declenchait jamais dans le hero.
const HIDE_AFTER = 200

export function Navigation() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 60)

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > HIDE_AFTER) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const linkClass = (href: string, isOrange = false) => {
    const isActive = pathname === href
    if (isActive) {
      return `px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-sm ${
        isOrange ? 'bg-orange-700 text-white' : 'bg-blue-900 text-white'
      }`
    }
    return `px-4 py-2 text-sm font-semibold rounded-full transition-all ${
      isOrange
        ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
    }`
  }

  // La capsule flotte au-dessus du contenu : elle n'est jamais collee aux bords,
  // ce qui evite l'effet « barre » et fonctionne aussi bien sur le panneau clair
  // du hero que par-dessus une photo.
  return (
    <div
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 px-12 pt-4 transition-transform duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-[130%]'
      }`}
    >
      <nav
        className={`flex items-center justify-between gap-6 rounded-full px-4 py-2 backdrop-blur-xl ring-1 ring-gray-900/5 transition-all duration-500 ${
          isScrolled ? 'bg-white/90 shadow-xl' : 'bg-white/75 shadow-lg'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 group pr-2">
          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-700/20 group-hover:ring-blue-900/50 transition-all">
            <Image
              src="/images/test-logo.webp"
              alt="AAFD Val de Saône Logo"
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <span className="text-xl font-bold text-blue-700">AAFD Val de Saône</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/notre-association" className={linkClass('/notre-association')}>Notre association</Link>
          <Link href="/actualites" className={linkClass('/actualites')}>Actualités</Link>
          <Link href="/vente-plats" className={linkClass('/vente-plats', true)}>Nos plats</Link>
          <Link href="/temoignages" className={linkClass('/temoignages')}>Témoignages</Link>
          <Link href="/nous-rejoindre" className={linkClass('/nous-rejoindre')}>Nous rejoindre</Link>
          <Link href="/contact" className={linkClass('/contact')}>Contact</Link>
        </div>
      </nav>
    </div>
  )
}
