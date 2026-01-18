import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Contact - AAFD Val de Saône',
  description: 'Contactez l\'AAFD pour toute question, demande d\'aide ou proposition de bénévolat',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Contactez-nous"
        description="Nous sommes là pour vous écouter et vous accompagner."
        imageSrc="/images/hero_contact.webp"
        imageAlt="Contactez-nous"
        gradientFrom="from-slate-900/90"
        gradientTo="to-slate-800/70"
      />

      {/* Section avec formulaire et infos de contact */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Colonne de gauche - Informations de contact */}
            <div className="lg:col-span-1 lg:pt-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Restons en contact
              </h2>
              <p className="text-slate-600 mb-8">
                L'association AAFD s'engage à répondre dans les meilleurs délais. Chaque message est important pour nous.
              </p>

              {/* Liste compacte des contacts */}
              <div className="space-y-5">
                {/* Téléphone */}
                <div className="flex items-start gap-3">
                  <svg className="h-10 w-10 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Téléphone</p>
                    <a href="tel:+33612345678" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      06 12 34 56 78
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <svg className="h-10 w-10 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Email</p>
                    <a href="mailto:aafd@gmx.fr" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      aafd@gmx.fr
                    </a>
                    <p className="text-sm text-slate-500 mt-1">Réponse sous 48h</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-3">
                  <svg className="h-10 w-10 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Instagram</p>
                    <a 
                      href="https://www.instagram.com/aafd_asso/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      @aafd_asso
                    </a>
                    <p className="text-sm text-slate-500 mt-1">Suivez nos actualités</p>
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-start gap-3">
                  <svg className="h-10 w-10 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Territoire</p>
                    <p className="text-blue-600 font-medium">Val de Saône</p>
                    <p className="text-sm text-slate-500 mt-1">Rhône, France</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-slate-600 mb-8">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
