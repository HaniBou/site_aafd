import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* À propos avec logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/images/test-logo.webp" 
                alt="AAFD Logo" 
                width={45} 
                height={45}
                className="object-contain"
              />
              <h3 className="text-xl font-bold">AAFD Val de Saône</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Association d&apos;Aide aux Familles en Difficulté
              <br />
              Accompagnement des familles réfugiées sur le Val de Saône
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-400">Navigation</h3>
            {/* grid-cols-2 sur mobile, block (1 colonne) sur tablette et plus */}
            <ul className="grid grid-cols-2 md:block gap-y-2.5 gap-x-4 text-sm">
              <li>
                <Link href="/nous-connaitre" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Nous connaître
                </Link>
              </li>
              <li>
                <Link href="/notre-action" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Notre action
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/temoignages" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="/nous-soutenir" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Nous soutenir
                </Link>
              </li>
              <li>
                <Link href="/nous-rejoindre" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Nous rejoindre
                </Link>
              </li>
              {/* Le dernier item prend toute la largeur sur mobile si tu veux ou reste dans la grille */}
              <li className="col-span-2 md:col-span-1">
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">→</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
  <h3 className="mb-4 text-lg font-semibold text-blue-400">Contact</h3>
  {/* space-y-4 pour un espacement uniforme et aéré */}
  <ul className="space-y-4 text-sm text-gray-300">
    <li className="flex items-center gap-3"> {/* gap-3 c'est un peu plus aéré pour les doigts sur mobile */}
      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <a href="mailto:aafd@gmx.fr" className="hover:text-blue-400 transition-colors">
        aafd@gmx.fr
      </a>
    </li>
    <li className="flex items-center gap-3">
      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Val de Saône, France</span>
    </li>
    <li className="flex items-center gap-3">
      <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      <a
        href="https://www.instagram.com/aafd_asso"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-pink-400 transition-colors"
      >
        @aafd_asso
      </a>
    </li>
  </ul>
</div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-8">
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
    {/* text-center centre le texte sur mobile, md:text-left le remet à gauche sur PC */}
    <p className="text-center md:text-left">
      &copy; {new Date().getFullYear()} AAFD Val de Saône. Tous droits réservés.
    </p>
    
    {/* text-center centre le texte sur mobile, md:text-right le pousse à droite sur PC */}
    <p className="text-xs text-center md:text-right">
      Association loi 1901 à but non lucratif
    </p>
  </div>
</div>
      </div>
    </footer>
  )
}
