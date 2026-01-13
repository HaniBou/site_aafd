import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact - AAFD Val de Saône',
  description: 'Contactez l\'AAFD pour toute question, demande d\'aide ou proposition de bénévolat',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 py-20 md:py-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Nous contacter
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Une question ? Un projet ? Envie de nous rejoindre ? N&apos;hésitez pas à nous contacter, 
              nous vous répondrons dans les meilleurs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Moyens de contact - Plus grands et visuels */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💬 Trois façons de nous joindre
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le moyen qui vous convient le mieux
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Email - Plus grand */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:-translate-y-2">
              <div className="relative">
                <div className="mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Par Email</h3>
                  <a href="mailto:aafd@gmx.fr" className="text-3xl font-extrabold hover:text-blue-100 transition-colors block mb-6 break-all">
                    aafd@gmx.fr
                  </a>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Le moyen le plus rapide pour nous contacter. Réponse sous 48h maximum.
                  </p>
                </div>
                <a 
                  href="mailto:aafd@gmx.fr"
                  className="inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-colors group-hover:gap-4"
                >
                  Envoyer un message
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Instagram - Plus grand */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-12 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:-translate-y-2">
              <div className="relative">
                <div className="mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Sur Instagram</h3>
                  <p className="text-3xl font-extrabold hover:text-pink-100 transition-colors mb-6">
                    @aafd_asso
                  </p>
                  <p className="text-xl text-pink-100 leading-relaxed">
                    Suivez nos actualités, événements et découvrez notre quotidien.
                  </p>
                </div>
                <a 
                  href="https://www.instagram.com/aafd_asso/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-pink-700 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-pink-50 transition-colors group-hover:gap-4"
                >
                  Voir le profil
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Localisation - Plus grand */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 p-12 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:-translate-y-2">
              <div className="relative">
                <div className="mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Notre territoire</h3>
                  <p className="text-3xl font-extrabold mb-6">
                    Val de Saône
                  </p>
                  <p className="text-xl text-green-100 leading-relaxed">
                    Nous intervenons sur l'ensemble du territoire du Val de Saône.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-xl">
                  📍 Rhône, France
                </div>
              </div>
            </div>
          </div>

          {/* Info disponibilité */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-10 text-white shadow-2xl">
              <div className="relative flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">⏰ Notre disponibilité</h3>
                  <p className="text-2xl text-orange-100 leading-relaxed">
                    Nous sommes une association 100% bénévole. Nous vous répondrons par email dans les <strong>48 heures maximum</strong>. Merci de votre compréhension et de votre patience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Raisons de contact - Plus visuel et espacé */}
      <section className="py-20 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🎯 Pourquoi nous contacter ?
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Nous sommes là pour vous accompagner dans vos démarches
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {/* Devenir bénévole */}
            <div className="group p-10 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl hover:border-blue-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Devenir bénévole
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Rejoignez notre équipe et donnez de votre temps pour aider les familles en difficulté
                </p>
                <Link 
                  href="/nous-rejoindre"
                  className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold text-lg group-hover:gap-3 transition-all"
                >
                  En savoir plus
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Faire un don */}
            <div className="group p-10 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl hover:border-orange-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Faire un don
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Soutenez financièrement nos actions et bénéficiez d'avantages fiscaux
                </p>
                <Link 
                  href="/nous-soutenir"
                  className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-900 font-bold text-lg group-hover:gap-3 transition-all"
                >
                  En savoir plus
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Demander de l'aide */}
            <div className="group p-10 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl hover:border-green-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Demander de l&apos;aide
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Nous sommes là pour vous accompagner. Contactez-nous en toute confidentialité
                </p>
                <div className="text-green-700 font-bold text-lg">
                  🔒 Discrétion assurée
                </div>
              </div>
            </div>

            {/* Demande de presse */}
            <div className="group p-10 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl hover:border-purple-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Presse & Médias
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Journaliste, blogueur ? Contactez-nous pour un entretien ou des informations
                </p>
                <div className="text-purple-700 font-bold text-lg">
                  📰 Kit de presse disponible
                </div>
              </div>
            </div>

            {/* Partenariat */}
            <div className="group p-10 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-3xl hover:border-pink-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Devenir partenaire
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Entreprise, association, collectivité ? Développons ensemble un partenariat
                </p>
                <div className="text-pink-700 font-bold text-lg">
                  🤝 Collaboration gagnante
                </div>
              </div>
            </div>

            {/* Question générale */}
            <div className="group p-10 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-3xl hover:border-yellow-500 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-yellow-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Autre demande
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Une question sur nos actions, événements ou notre fonctionnement ?
                </p>
                <div className="text-yellow-700 font-bold text-lg">
                  💬 Nous vous écoutons
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Email - Plus imposant */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-24 md:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-orange-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-5xl px-6 sm:px-8 lg:px-12 text-center">
          <div className="mb-8 inline-block">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl px-8 py-3 border border-white/30">
              <p className="text-2xl font-semibold">✉️ Un seul clic suffit</p>
            </div>
          </div>
          <h2 className="mb-6 text-4xl md:text-6xl font-extrabold">
            Prêt à nous écrire ?
          </h2>
          <p className="mb-12 text-2xl md:text-3xl text-blue-100 leading-relaxed">
            Quelle que soit votre demande, nous serons ravis de vous répondre
          </p>
          <a
            href="mailto:aafd@gmx.fr"
            className="inline-flex items-center gap-4 rounded-3xl bg-white text-blue-700 px-12 py-6 text-2xl font-bold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Envoyer un email maintenant
          </a>
          <p className="mt-8 text-xl text-blue-200">
            ⏱️ Réponse sous 48 heures maximum
          </p>
        </div>
      </section>

      {/* Liens rapides - Plus moderne */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔍 Vous cherchez autre chose ?
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos autres pages
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Link
              href="/nous-connaitre"
              className="group relative overflow-hidden p-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:-translate-y-1 text-white"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-3">Qui sommes-nous ?</h3>
                <p className="text-blue-100 text-lg">Notre histoire et nos valeurs</p>
              </div>
            </Link>
            <Link
              href="/notre-action"
              className="group relative overflow-hidden p-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:-translate-y-1 text-white"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-3">Nos actions</h3>
                <p className="text-orange-100 text-lg">Événements et projets</p>
              </div>
            </Link>
            <Link
              href="/temoignages"
              className="group relative overflow-hidden p-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:-translate-y-1 text-white"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-3">Témoignages</h3>
                <p className="text-green-100 text-lg">Bénévoles et familles</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
