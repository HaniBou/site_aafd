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
    <div className={`lg:hidden sticky top-0 z-50 bg-white/98 backdrop-blur-lg border-b border-gray-100 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="mx-auto w-full px-5">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#1e3a5f]/10">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-base font-bold text-[#1e3a5f]">AAFD</span>
          </Link>
          
          {/* Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#1e3a5f] hover:bg-gray-50 transition-colors"
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
          <nav className="py-4 space-y-1 border-t border-gray-100">
            <Link
              href="/nous-connaitre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                pathname === '/nous-connaitre' 
                  ? 'bg-[#1e3a5f] text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e3a5f]'
              }`}
            >
              Nous connaître
            </Link>
            <Link
              href="/notre-action"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                pathname === '/notre-action' 
                  ? 'bg-[#1e3a5f] text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e3a5f]'
              }`}
            >
              Notre action
            </Link>
            <Link
              href="/actualites"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                pathname === '/actualites' 
                  ? 'bg-[#1e3a5f] text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e3a5f]'
              }`}
            >
              Actualités
            </Link>
            <Link
              href="/vente-plats"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                pathname === '/vente-plats' 
                  ? 'bg-[#e67e22] text-white' 
                  : 'text-[#e67e22] hover:bg-[#fdf3e8]'
              }`}
            >
              Nos plats
            </Link>
            <Link
              href="/temoignages"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                pathname === '/temoignages' 
                  ? 'bg-[#1e3a5f] text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e3a5f]'
              }`}
            >
              Témoignages
            </Link>
            <Link
              href="/nous-rejoindre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                pathname === '/nous-rejoindre' 
                  ? 'bg-[#1e3a5f] text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e3a5f]'
              }`}
            >
              Nous rejoindre
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all border-2 mt-2 ${
                pathname === '/contact' 
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' 
                  : 'text-[#1e3a5f] border-[#1e3a5f]/20 hover:border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'
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
