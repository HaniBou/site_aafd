"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { getCategoryStyles } from '@/lib/categoryStyles';
import type { Actualite } from "@/types";
import { INSTAGRAM_URL } from "@/lib/siteConfig";
import { Reveal } from "@/components/Reveal";
import { actualiteHref } from "@/lib/slug";
import { Button } from "@/components/ui/Button";
import { CtaBand } from '@/components/ui/CtaBand';

type Props = {
  actualites: Actualite[];
  loadError?: boolean;
};

const CATEGORIES = ["Tout", "Actualité", "Vente", "Événement", "Annonce"];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

const truncate = (text: string, max: number) =>
  text.length > max ? text.substring(0, max) + "…" : text;

export default function ActualitesPageClient({ actualites, loadError = false }: Props) {
  const [activeCategory, setActiveCategory] = useState("Tout");

  const { actuALaUne, autresActus } = useMemo(() => {
    const sorted = [...actualites].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const featured = sorted.find(a => a.aLaUne) ?? sorted[0] ?? null;
    return {
      actuALaUne: featured,
      autresActus: sorted.filter(a => a.id !== featured?.id),
    };
  }, [actualites]);

  const filtered = activeCategory === "Tout"
    ? autresActus
    : autresActus.filter(a => a.category === activeCategory);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Actualités"
        description="Suivez nos actions, événements et témoignages tout au long de l'année"
        imageSrc="/images/hero_actu.webp"
        imageAlt="Actualités"
      />

      {actuALaUne && (
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-10">
              <span className="px-4 py-1.5 bg-orange-700 text-white text-xs font-bold tracking-widest uppercase rounded-full">
                À la une
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="group grid md:grid-cols-5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <Link href={actualiteHref(actuALaUne)} className="relative md:col-span-3 h-[260px] md:h-[460px] block bg-gray-200 overflow-hidden">
                {actuALaUne.image && actuALaUne.image !== 'none' ? (
                  <Image
                    src={actuALaUne.image}
                    alt={actuALaUne.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700" />
                )}
              </Link>

              <div className="md:col-span-2 flex flex-col justify-center p-8 md:p-12 bg-gray-50">
                <span className={`self-start mb-3 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full ${getCategoryStyles(actuALaUne.category)}`}>
                  {actuALaUne.category}
                </span>
                <p className="text-xs text-gray-600 mb-3 uppercase tracking-wide">{formatDate(actuALaUne.date)}</p>
                <Link href={actualiteHref(actuALaUne)}>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4 hover:text-blue-900 transition-colors">
                    {actuALaUne.title}
                  </h2>
                </Link>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                  {truncate(actuALaUne.content, 240)}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={actualiteHref(actuALaUne)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
                  >
                    Lire la suite
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {actuALaUne.category === "Vente de plats" && (
                    <Button href="/vente-plats" variant="primary" size="sm" className="ml-auto">
                      Commander
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-900 text-white shadow-md scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-900 hover:text-blue-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadError ? (
            <p className="text-center text-gray-700 py-24">
              Les actualités n&apos;ont pas pu être chargées. Merci de réessayer dans quelques instants.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-600 py-24">Aucune actualité dans cette catégorie.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((actu, i) => (
                <Reveal key={actu.id} delay={(i % 3) * 100} className="h-full">
                <article className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="relative h-52 bg-gray-200 overflow-hidden">
                    {actu.image && actu.image !== 'none' ? (
                      <Image
                        src={actu.image}
                        alt={actu.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700" />
                    )}
                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full ${getCategoryStyles(actu.category)}`}>
                      {actu.category}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">{formatDate(actu.date)}</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-900 transition-colors">
                      {actu.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">
                      {truncate(actu.content, 140)}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <Link
                        href={actualiteHref(actu)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
                      >
                        Lire la suite
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {actu.category === "Vente" && (
                        <Button
                          href="/vente-plats"
                          variant="primary"
                          size="sm"
                          className="relative z-10"
                        >
                          Commander
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Restez informé"
        description="Suivez-nous sur Instagram pour ne rien manquer de nos actualités et événements"
      >
        <Button
          href={INSTAGRAM_URL}
          variant="instagram"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Suivez-nous sur Instagram
        </Button>
        <Button href="/contact" variant="onDark" size="lg">
          Nous contacter
        </Button>
      </CtaBand>
    </main>
  );
}
