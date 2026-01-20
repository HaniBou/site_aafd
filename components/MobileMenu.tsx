'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function MobileMenu() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (currentScrollY < lastScrollY || currentScrollY < 50) {
            // Scroll vers le haut ou en haut de la page
            setIsVisible(true)
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scroll vers le bas
            setIsVisible(false)
            setMobileMenuOpen(false) // Fermer le menu si ouvert
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div className={`lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="mx-auto w-full px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-900/20">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-bold text-blue-900">AAFD Val de Saône</span>
          </Link>
          
          {/* Bouton Menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-gray-700 hover:bg-blue-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="py-4 space-y-2 border-t border-gray-100">
            <Link
              href="/nous-connaitre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/nous-connaitre' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Nous connaître
            </Link>
            <Link
              href="/notre-action"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/notre-action' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Notre action
            </Link>
            <Link
              href="/actualites"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/actualites' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Actualités
            </Link>
            <Link
              href="/vente-plats"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/vente-plats' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              Nos plats
            </Link>
            <Link
              href="/temoignages"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/temoignages' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Témoignages
            </Link>
            <Link
              href="/nous-rejoindre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/nous-rejoindre' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Nous rejoindre
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                pathname === '/contact' 
                  ? 'bg-blue-900 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </div>
  )
}
