'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
      } else if (currentScrollY > lastScrollY && currentScrollY > window.innerHeight * 0.7) {
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
      return `px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-lg scale-105 ${
        isOrange ? 'bg-orange-600 text-white' : 'bg-blue-900 text-white'
      }`
    }
    return `px-4 py-2 text-sm font-semibold rounded-full transition-all ${
      isScrolled
        ? isOrange
          ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
        : 'text-white hover:bg-white/15 drop-shadow-md'
    }`
  }

  return (
    <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-blue-700/20 group-hover:ring-blue-900/50 transition-all">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className={`text-xl font-bold transition-colors duration-500 ${
              isScrolled ? 'text-blue-700' : 'text-white drop-shadow-md'
            }`}>
              AAFD Val de Saône
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/notre-association" className={linkClass('/notre-association')}>Notre association</Link>
            <Link href="/actualites" className={linkClass('/actualites')}>Actualités</Link>
            <Link href="/vente-plats" className={linkClass('/vente-plats', true)}>Nos plats</Link>
            <Link href="/temoignages" className={linkClass('/temoignages')}>Témoignages</Link>
            <Link href="/nous-rejoindre" className={linkClass('/nous-rejoindre')}>Nous rejoindre</Link>
            <Link href="/contact" className={linkClass('/contact')}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
