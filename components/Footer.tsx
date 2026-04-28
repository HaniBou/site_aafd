import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#152a45] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* À propos avec logo */}
          <div className="md:col-span-2">
            <Link href="#top" className="flex items-center space-x-3 group mb-5" scroll={true} aria-label="Remonter en haut de la page">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                <Image
                  src="/images/test-logo.webp"
                  alt="AAFD Val de Saône Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white group-hover:text-[#e67e22] transition-colors">AAFD Val de Saône</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Association d&apos;Aide aux Familles en Difficulté
              <br />
              Accompagnement des familles réfugiées sur le Val de Saône
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="grid grid-cols-2 md:block gap-y-2.5 gap-x-4 text-sm">
              <li>
                <Link href="/nous-connaitre" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Nous connaître
                </Link>
              </li>
              <li>
                <Link href="/notre-action" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Notre action
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/temoignages" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="/nous-soutenir" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Nous soutenir
                </Link>
              </li>
              <li>
                <Link href="/nous-rejoindre" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Nous rejoindre
                </Link>
              </li>
              <li className="col-span-2 md:col-span-1">
                <Link href="/contact" className="text-white/60 hover:text-[#e67e22] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="tel:+33612345678" className="text-white/60 hover:text-[#e67e22] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-[#e67e22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                06 12 34 56 78
              </a>
            </li>
            <li>
              <a href="mailto:aafd@gmx.fr" className="text-white/60 hover:text-[#e67e22] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-[#e67e22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                aafd@gmx.fr
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/aafd_asso" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#e67e22] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-[#e67e22]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @aafd_asso
              </a>
            </li>
          </ul>
        </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>
              &copy; {new Date().getFullYear()} AAFD Val de Saône. Tous droits réservés.
            </p>
            <p className="text-xs">
              Association loi 1901 à but non lucratif
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
