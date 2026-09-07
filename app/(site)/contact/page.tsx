import { Metadata } from 'next'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import { PageHero } from '@/components/PageHero'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PERSON,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  HELLOASSO_URL,
} from '@/lib/siteConfig'
import { LIENS_UTILES, ACCENTS_LIENS, domaineLisible } from '@/lib/liensUtiles'
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contactez l'AAFD Val de Saône pour toute question, demande d'aide ou proposition de bénévolat. Téléphone, email, formulaire et liens vers d'autres sites utiles.",
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact | AAFD Val de Saône', description: "Contactez l'AAFD pour toute question ou proposition de bénévolat.", url: '/contact' },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Contactez-nous"
        description="Nous sommes là pour vous écouter et vous accompagner."
        imageSrc="/images/hero_contact.webp"
        imageAlt="Contactez-nous"
      />

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-1 lg:pt-10">
  <h2 className="text-3xl font-bold text-gray-900 mb-4">
    Restons en contact
  </h2>
  <p className="text-gray-600 mb-10 text-lg leading-relaxed">
    L&apos;association AAFD s&apos;engage à répondre dans les meilleurs délais. Chaque message est important pour nous.
  </p>

  <div className="space-y-8">
    <div className="flex items-center gap-4 group">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-bold text-gray-600 mb-0.5">Appelez-nous</p>
        <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors">
          {CONTACT_PHONE}
        </a>
        {CONTACT_PERSON && (
          <p className="text-sm text-gray-600 mt-0.5">{CONTACT_PERSON}</p>
        )}
      </div>
    </div>

    <div className="flex items-center gap-4 group">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-bold text-gray-600 mb-0.5">Écrivez-nous</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors">
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>

    <div className="flex items-center gap-4 group">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-bold text-gray-600 mb-0.5">Instagram</p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors">
          {INSTAGRAM_HANDLE}
        </a>
      </div>
    </div>
  </div>

  <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50/60 p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-2">Soutenir l&apos;association</h3>
    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
      Vos dons financent directement l&apos;aide matérielle aux familles :
      transports, assurances, frais d&apos;avocats, hébergement.
    </p>
    <Button
      href={HELLOASSO_URL}
      variant="donate"
      size="sm"
      target="_blank"
      rel="noopener noreferrer"
    >
      Faire un don sur HelloAsso
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </Button>
  </div>
</div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600 mb-8">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.2em] text-blue-900">
              Ressources
            </span>
            <h2 className="text-gray-900">Liens vers d&apos;autres sites utiles</h2>
            <p className="text-body-large mx-auto max-w-2xl text-gray-600">
              L&apos;AAFD ne peut pas répondre à tout. Voici les structures vers lesquelles
              nous orientons régulièrement les familles et les bénévoles.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LIENS_UTILES.map((lien) => {
              const accent = ACCENTS_LIENS[lien.accent]
              return (
                <li key={lien.url}>
                  <a
                    href={lien.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-5 flex h-20 items-center justify-center">
                      {lien.logo?.endsWith('.svg') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={lien.logo}
                          alt=""
                          className={`${lien.hauteurLogo ?? 'h-12'} w-auto max-w-full object-contain`}
                        />
                      ) : lien.logo ? (
                        <Image
                          src={lien.logo}
                          alt=""
                          width={240}
                          height={80}
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                          className={`${lien.hauteurLogo ?? 'h-12'} w-auto max-w-full object-contain ${lien.fondOpaque ? 'rounded-lg' : ''}`}
                        />
                      ) : (
                        <span className={`text-xl font-bold leading-tight ${accent.repli}`}>
                          {lien.nom}
                        </span>
                      )}
                    </div>

                    {lien.logo && (
                      <p className="font-bold text-gray-900">{lien.nom}</p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {lien.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                      <span className="truncate font-mono text-xs text-gray-400">
                        {domaineLisible(lien.url)}
                      </span>
                      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${accent.fleche}`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H9m8 0v8" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>

          <p className="mt-8 text-center text-sm text-gray-500">
            Ces sites sont indépendants de l&apos;AAFD. Les liens s&apos;ouvrent dans un nouvel onglet.
          </p>
        </div>
      </section>
    </main>
  )
}
