"use client";

import Link from 'next/link';
import Image from 'next/image';
import getActualites from "@/lib/getActualites";
import { useEffect, useState } from "react";

// Définir le type des actualités
interface Actualite {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
  slug: string;
}

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getActualites();
      // Trier les actualités par date décroissante (la plus récente en premier)
      const sortedData = data.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setActualites(sortedData);
    }
    fetchData();
  }, []);

  const fallbackImage = "/images/placeholder.png"; // Image par défaut

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Dernière actualité mise en avant */}
      {actualites.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-medium tracking-wide rounded-full">
                À la une
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image SVG Placeholder */}
              <div className="h-[350px] md:h-[450px] bg-gray-100 flex items-center justify-center rounded-sm">
                <svg className="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              {/* Contenu */}
              <div>
                <span className="text-blue-600 text-xs font-medium tracking-wide uppercase">
                  {actualites[0].category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-3 leading-tight">
                  {actualites[0].title}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {new Date(actualites[0].date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {actualites[0].content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Liste des actualités */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-16 text-center">
            Toutes nos actualités
          </h2>

          <div className="space-y-20">
            {actualites.slice(1).map((actu, index) => (
              <div
                key={actu.id}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:grid-flow-dense" : ""
                }`}
              >
                {/* Image SVG Placeholder */}
                <div className={`h-[300px] md:h-[350px] bg-gray-100 flex items-center justify-center rounded-sm ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
                  <svg className="h-20 w-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                {/* Contenu */}
                <div className={index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                  <span className="text-blue-600 text-xs font-medium tracking-wide uppercase">
                    {actu.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-2 leading-tight">
                    {actu.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(actu.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-justify">
                    {actu.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Newsletter ou Réseaux sociaux */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
            Restez informé
          </h2>
          <p className="mb-8 text-2xl text-blue-100 leading-relaxed">
            Suivez-nous sur Instagram pour ne rien manquer de nos actualités et événements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/aafd_asso/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
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
