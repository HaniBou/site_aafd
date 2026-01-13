'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md border-b-2 border-blue-100">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image 
                src="/images/test-logo.webp" 
                alt="AAFD Logo" 
                width={55} 
                height={55}
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                AAFD
              </div>
              <div className="hidden lg:block text-xs text-gray-600 font-medium">
                Val de Saône
              </div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/nous-connaitre"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/nous-connaitre' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Nous connaître
            </Link>
            <Link
              href="/notre-action"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/notre-action' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Notre action
            </Link>
            <Link
              href="/actualites"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/actualites' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Actualités
            </Link>
            <Link
              href="/vente-plats"
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                pathname === '/vente-plats' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              🍲 Nos plats
            </Link>
            <Link
              href="/temoignages"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/temoignages' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Témoignages
            </Link>
            <Link
              href="/nous-soutenir"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/nous-soutenir' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Nous soutenir
            </Link>
            <Link
              href="/nous-rejoindre"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/nous-rejoindre' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Nous rejoindre
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                pathname === '/contact' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Contact
            </Link>
            
            {/* Bouton Don */}
            <a
              href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="hidden lg:inline">Faire un don</span>
              <span className="lg:hidden">Don</span>
            </a>
          </nav>

          {/* Boutons Mobile: Don + Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Bouton Don Mobile */}
            <a
              href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Faire un don</span>
            </a>
            
            {/* Bouton Menu */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors"
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-1 border-t-2 border-blue-100 bg-gradient-to-b from-blue-50 to-white">
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/nous-connaitre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/nous-connaitre' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Nous connaître
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/notre-action"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/notre-action' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Notre action
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/actualites"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/actualites' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Actualités
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/vente-plats"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                pathname === '/vente-plats' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              🍲 Nos plats
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/temoignages"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/temoignages' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Témoignages
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/nous-soutenir"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/nous-soutenir' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Nous soutenir
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/nous-rejoindre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/nous-rejoindre' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Nous rejoindre
            </Link>
            <div className="h-px bg-blue-200 mx-4"></div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block mx-4 px-4 py-2.5 rounded-lg font-medium transition-all ${
                pathname === '/contact' 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
