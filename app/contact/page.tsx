import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Contact - AAFD Val de Saône',
  description: 'Contactez l\'AAFD pour toute question, demande d\'aide ou proposition de bénévolat',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero avec illustration */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        {/* Illustration en arrière-plan */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block  pointer-events-none">
          <Image
            src="/images/contct.svg"
            alt=""
            fill
            className="object-contain object-right"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Contactez-nous
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nous sommes là pour vous écouter et vous accompagner.
            </p>
          </div>
        </div>
      </section>

      {/* Moyens de contact */}
      <section className="py-20 md:py-32 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {/* Email */}
            <a 
              href="mailto:aafd@gmx.fr"
              className="group p-8 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-blue-600 font-medium mb-2">aafd@gmx.fr</p>
              <p className="text-sm text-slate-600">Réponse sous 48h</p>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/aafd_asso/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-8 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-7 w-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instagram</h3>
              <p className="text-blue-600 font-medium mb-2">@aafd_asso</p>
              <p className="text-sm text-slate-600">Suivez nos actualités</p>
            </a>

            {/* Localisation */}
            <div className="p-8 bg-slate-50 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Territoire</h3>
              <p className="text-blue-600 font-medium mb-2">Val de Saône</p>
              <p className="text-sm text-slate-600">Rhône, France</p>
            </div>
          </div>

          {/* Note bénévoles */}
          <div className="p-6">
            <p className="text-center text-slate-700">
              <span className="font-semibold">L’association AAFD s’engage à répondre dans les meilleurs délais.
Chaque message est important pour nous.</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
