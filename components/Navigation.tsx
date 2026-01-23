'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scroll vers le haut ou en haut de la page
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll vers le bas
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav className={`hidden lg:block sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-700/20 group-hover:ring-blue-900/50 transition-all">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-blue-700">AAFD Val de Saône</span>
          </Link>

          {/* Navigation Links avec style blob */}
          <div className="flex items-center gap-3">
            <Link
              href="/nous-connaitre"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/nous-connaitre'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Nous connaître
            </Link>

            <Link
              href="/notre-action"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/notre-action'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Notre action
            </Link>

            <Link
              href="/actualites"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/actualites'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Actualités
            </Link>

            <Link
              href="/vente-plats"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/vente-plats'
                  ? 'bg-orange-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              Nos plats
            </Link>

            <Link
              href="/temoignages"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/temoignages'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Témoignages
            </Link>

            <Link
              href="/nous-rejoindre"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/nous-rejoindre'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Nous rejoindre
            </Link>

            <Link
              href="/contact"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                pathname === '/contact'
                  ? 'bg-blue-900 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
