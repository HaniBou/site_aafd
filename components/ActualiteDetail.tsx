import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from "@/components/PageHero";
import { getCategoryStyles } from '@/lib/categoryStyles';
import type { Actualite } from '@/types';
import { INSTAGRAM_URL } from '@/lib/siteConfig';

export default function ActualiteDetail({ actualite }: { actualite: Actualite }) {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Actualités"
        description="Suivez nos actions, événements et témoignages tout au long de l'année"
        imageSrc="/images/hero_actu.webp"
        imageAlt="Actualités"
        titleTag="p"
      />

      <article className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-blue-700 hover:underline font-medium mb-10 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux actualités
          </Link>

          <div className="mb-8">
            <h1 className="font-extrabold text-gray-900 mb-6 text-center md:text-left">{actualite.title}</h1>

            <div className="flex items-center gap-4 text-gray-600 text-base mb-8">
              <span className={`inline-block px-4 py-2 text-sm font-semibold tracking-wide uppercase rounded-full ${getCategoryStyles(actualite.category)}`}>
                {actualite.category}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(actualite.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {actualite.image && actualite.image !== 'none' && (
              <div className="float-right ml-8 mb-6 w-full md:w-1/2 lg:w-2/5">
                <div className="relative h-[300px] md:h-[400px] bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={actualite.image}
                    alt={actualite.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            )}

            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              {actualite.content}
            </div>

            {actualite.category === "Vente de plats" && (
              <div className="mt-6 flex justify-center md:justify-start">
                <Link
                  href="/vente-plats"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Commander
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          <div className="clear-both mt-16 pt-10 border-t border-gray-200">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline font-medium transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux actualités
            </Link>
          </div>
        </div>
      </article>

      <section className="bg-blue-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>Restez informé</h2>
          <p className="mb-8 text-body-large text-blue-100">
            Suivez-nous sur Instagram pour ne rien manquer de nos actualités et événements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-purple-700 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-800 transition-all shadow-lg"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Suivez-nous sur Instagram
            </a>
            <Link
              href="/contact"
              className="inline-block rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
