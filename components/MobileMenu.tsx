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

  // Meme capsule flottante que sur desktop. Le rayon est fixe a 32px : ferme,
  // la capsule fait 64px de haut, l'arrondi est donc exactement celui d'une
  // pilule, et rien ne se deforme a l'ouverture.
  return (
    <div
      className={`lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-3 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        isVisible ? 'translate-y-0' : '-translate-y-[130%]'
      }`}
    >
      <div
        className={`rounded-[32px] backdrop-blur-xl ring-1 ring-gray-900/5 transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none ${
          isScrolled || mobileMenuOpen ? 'bg-white/95 shadow-xl' : 'bg-white/80 shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-900/20">
              <Image
                src="/images/test-logo.webp"
                alt="AAFD Val de Saône Logo"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <span className="text-lg font-bold text-blue-900">AAFD Val de Saône</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full transition-colors min-w-11 min-h-11 flex items-center justify-center text-gray-700 hover:bg-blue-50"
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

        {/* grid-rows 0fr > 1fr : l'animation vise la hauteur reelle du contenu,
            contrairement a un max-height arbitraire qui laisse un temps mort. */}
        <div
          id="mobile-menu-panel"
          inert={!mobileMenuOpen}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
            mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <nav className="mx-3 py-3 space-y-1 border-t border-gray-100">
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
                  className={`block px-4 py-2.5 text-sm font-semibold rounded-full transition-colors ${
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
    </div>
  )
}
