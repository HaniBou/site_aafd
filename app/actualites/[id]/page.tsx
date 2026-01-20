"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHero } from "@/components/PageHero";
import { getCategoryStyles } from '@/lib/categoryStyles';

interface Actualite {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

export default function ActualiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [loading, setLoading] = useState(true);
  const [actualiteId, setActualiteId] = useState<string>("");

  useEffect(() => {
    async function initParams() {
      const resolvedParams = await params;
      setActualiteId(resolvedParams.id);
    }
    initParams();
  }, [params]);

  useEffect(() => {
    if (!actualiteId) return;
    
    async function fetchActualite() {
      try {
        const docRef = doc(db, "actualites", actualiteId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setActualite({ id: docSnap.id, ...docSnap.data() } as Actualite);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'actualité:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchActualite();
  }, [actualiteId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!actualite) {
    return (
      <main className="min-h-screen bg-white">
        <PageHero
          title="Actualité introuvable"
          description="Cette actualité n'existe pas ou a été supprimée"
          imageSrc="/images/hero_actu.webp"
          imageAlt="Actualités"
        />
        <div className="py-16 text-center">
          <Link
            href="/actualites"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux actualités
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title={actualite.title}
        description={actualite.category}
        imageSrc="/images/hero_actu.webp"
        imageAlt="Actualités"
      />

      <article className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Retour */}
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-10 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux actualités
          </Link>

          {/* Métadonnées et contenu */}
          <div className="mb-8">
            <div className="flex items-center gap-4 text-gray-500 text-base mb-8">
              <span className={`inline-block px-4 py-2 text-sm font-semibold tracking-wide uppercase rounded-full ${getCategoryStyles(actualite.category)}`}>
                {actualite.category}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(actualite.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Image habillée par le texte */}
            {actualite.image && actualite.image !== 'none' && (
              <div className="float-right ml-8 mb-6 w-full md:w-1/2 lg:w-2/5">
                <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={actualite.image}
                    alt={actualite.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Contenu */}
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              {actualite.content}
            </div>

            {/* Bouton CTA pour vente de plats */}
            {actualite.category === "Vente de plats" && (
              <div className="mt-6">
                <Link
                  href="/vente-plats"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Commander
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Bouton retour en bas */}
          <div className="clear-both mt-16 pt-10 border-t border-gray-200">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux actualités
            </Link>
          </div>
        </div>
      </article>

      {/* CTA Instagram */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>
            Restez informé
          </h2>
          <p className="mb-8 text-body-large text-blue-100">
            Suivez-nous sur Instagram pour ne rien manquer de nos actualités et événements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/aafd_asso/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
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
