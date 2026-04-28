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
    <nav className={`hidden lg:block sticky top-0 z-50 bg-white/98 backdrop-blur-lg border-b border-gray-100 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#1e3a5f]/10 group-hover:ring-[#1e3a5f]/30 transition-all duration-300">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-bold text-[#1e3a5f] tracking-tight">AAFD Val de Saône</span>
          </Link>

          {/* Navigation Links - refined minimal style */}
          <div className="flex items-center gap-1">
            <Link
              href="/nous-connaitre"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/nous-connaitre'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              Nous connaître
            </Link>

            <Link
              href="/notre-action"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/notre-action'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              Notre action
            </Link>

            <Link
              href="/actualites"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/actualites'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              Actualités
            </Link>

            <Link
              href="/vente-plats"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/vente-plats'
                  ? 'bg-[#e67e22] text-white'
                  : 'text-[#e67e22] hover:bg-[#fdf3e8]'
              }`}
            >
              Nos plats
            </Link>

            <Link
              href="/temoignages"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/temoignages'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              Témoignages
            </Link>

            <Link
              href="/nous-rejoindre"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/nous-rejoindre'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              Nous rejoindre
            </Link>

            <Link
              href="/contact"
              className={`ml-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                pathname === '/contact'
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'text-[#1e3a5f] border-[#1e3a5f]/20 hover:border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'
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
