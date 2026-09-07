'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function MobileMenu() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setIsScrolled(currentScrollY > 60)

          if (currentScrollY < lastScrollY || currentScrollY < 50) {
            setIsVisible(true)
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false)
            setMobileMenuOpen(false)
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

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen])

  return (
    <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="mx-auto w-full px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-900/20">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className={`text-lg font-bold transition-colors duration-500 ${
              isScrolled || mobileMenuOpen ? 'text-blue-900' : 'text-white drop-shadow-md'
            }`}>
              AAFD Val de Saône
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full transition-colors min-w-11 min-h-11 flex items-center justify-center ${
              isScrolled || mobileMenuOpen
                ? 'text-gray-700 hover:bg-blue-50'
                : 'text-white hover:bg-white/20'
            }`}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          id="mobile-menu-panel"
          inert={!mobileMenuOpen}
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
              mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 space-y-2 border-t border-gray-100">
            {[
              { href: '/notre-association', label: 'Notre association' },
              { href: '/actualites', label: 'Actualités' },
              { href: '/vente-plats', label: 'Nos plats', orange: true },
              { href: '/temoignages', label: 'Témoignages' },
              { href: '/nous-rejoindre', label: 'Nous rejoindre' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label, orange }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                  pathname === href
                    ? orange ? 'bg-orange-700 text-white' : 'bg-blue-900 text-white'
                    : orange ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                             : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
