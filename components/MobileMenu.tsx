'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function MobileMenu() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="lg:hidden border-t border-gray-200">
      <div className="mx-auto w-full px-6">
        <div className="flex items-center justify-between py-4">
          {/* Boutons CTA Mobile */}
          <div className="flex items-center gap-3">
            <Link
              href="/nous-rejoindre"
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xs font-bold uppercase rounded-full shadow-lg"
            >
              Bénévole
            </Link>
            <a
              href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white text-xs font-bold uppercase rounded-full shadow-lg"
            >
              Don
            </a>
          </div>
          
          {/* Bouton Menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
          <nav className="py-4 space-y-1 border-t border-gray-200">
            <Link
              href="/nous-connaitre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/nous-connaitre' 
                  ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Nous connaître
            </Link>
            <Link
              href="/notre-action"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/notre-action' 
                  ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Notre action
            </Link>
            <Link
              href="/actualites"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/actualites' 
                  ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Actualités
            </Link>
            <Link
              href="/vente-plats"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/vente-plats' 
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Nos plats
            </Link>
            <Link
              href="/temoignages"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/temoignages' 
                  ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Témoignages
            </Link>
            <Link
              href="/nous-soutenir"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/nous-soutenir' 
                  ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              Nous soutenir
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                pathname === '/contact' 
                  ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                  : 'text-black hover:bg-gray-50'
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
