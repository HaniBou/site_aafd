'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:block sticky top-0 z-50 border-t-2 border-b-2 border-gray-200 bg-white shadow-sm">
      <div className="mx-auto w-full px-6 lg:px-12">
        <div className="flex items-center justify-center">
          {/* Icône Home */}
          <Link
            href="/"
            className="px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/nous-connaitre"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/nous-connaitre' ? 'text-blue-900' : 'text-black hover:text-blue-600'
            }`}
          >
            Nous connaître
            {pathname === '/nous-connaitre' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-blue-900 animate-slideIn"></span>
            )}
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/notre-action"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/notre-action' ? 'text-blue-900' : 'text-black hover:text-blue-600'
            }`}
          >
            Notre action
            {pathname === '/notre-action' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-blue-900 animate-slideIn"></span>
            )}
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/actualites"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/actualites' ? 'text-blue-900' : 'text-black hover:text-blue-600'
            }`}
          >
            Actualités
            {pathname === '/actualites' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-blue-900 animate-slideIn"></span>
            )}
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/vente-plats"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/vente-plats' ? 'text-orange-600' : 'text-black hover:text-orange-600'
            }`}
          >
            Nos plats
            {pathname === '/vente-plats' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-orange-600 animate-slideIn"></span>
            )}
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/temoignages"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/temoignages' ? 'text-blue-900' : 'text-black hover:text-blue-600'
            }`}
          >
            Témoignages
            {pathname === '/temoignages' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-blue-900 animate-slideIn"></span>
            )}
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/nous-soutenir"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/nous-soutenir' ? 'text-blue-900' : 'text-black hover:text-blue-600'
            }`}
          >
            Nous soutenir
            {pathname === '/nous-soutenir' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-blue-900 animate-slideIn"></span>
            )}
          </Link>

          <div className="h-10 w-1 bg-gray-400"></div>

          <Link
            href="/contact"
            className={`relative px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/contact' ? 'text-blue-900' : 'text-black hover:text-blue-600'
            }`}
          >
            Contact
            {pathname === '/contact' && (
              <span className="absolute bottom-0 left-6 right-6 h-1 bg-blue-900 animate-slideIn"></span>
            )}
          </Link>
        </div>
      </div>

      {/* Animation pour le trait */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          transform-origin: left;
        }
      `}</style>
    </nav>
  )
}
