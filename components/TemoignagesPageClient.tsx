"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import type { Temoignage, Moment } from "@/types";
import { HELLOASSO_URL } from "@/lib/siteConfig";
import { Reveal } from "@/components/Reveal";

type Props = {
  temoignages: Temoignage[];
  moments: Moment[];
  loadError?: boolean;
};

export default function TemoignagesPageClient({ temoignages, moments, loadError = false }: Props) {
  const familyFallbacks = [
    { container: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-300", quote: "text-blue-900" },
    { container: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-300", quote: "text-orange-600" },
    { container: "bg-gradient-to-br from-green-100 to-green-200 text-green-300", quote: "text-green-700" },
  ];

  const benevoleFallbacks = [
    "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-300",
    "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-300",
    "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-300",
    "bg-gradient-to-br from-red-100 to-red-200 text-red-300",
    "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-400",
    "bg-gradient-to-br from-green-100 to-green-200 text-green-300",
  ];

  const { familles, benevoles } = useMemo(() => {
    const sorted = [...temoignages].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      familles: sorted.filter((item) => item.type === "Famille accompagnee"),
      benevoles: sorted.filter((item) => item.type === "Benevole"),
    };
  }, [temoignages]);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Témoignages"
        description="Ils ont été accompagnés par l'AAFD ou se sont engagés comme bénévoles. Découvrez leurs histoires et leurs parcours."
        imageSrc="/images/hero_temoignages.webp"
        imageAlt="Témoignages"
      />

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Chaque témoignage est une histoire unique. Des parcours de vie, des rencontres,
            des moments de solidarité qui changent des vies. Découvrez les visages et les voix
            de celles et ceux qui font vivre l&apos;AAFD au quotidien.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900">Témoignages des familles accompagnées</h2>
            <p className="text-body-large text-gray-600">Des parcours de résilience et d&apos;espoir</p>
          </div>

          {loadError ? (
            <p className="text-center text-gray-700">
              Les témoignages n&apos;ont pas pu être chargés. Merci de réessayer dans quelques instants.
            </p>
          ) : familles.length === 0 ? (
            <p className="text-center text-gray-600">Aucun témoignage famille pour le moment.</p>
          ) : (
            <div className="space-y-16">
              {familles.map((item, index) => {
                const isReversed = index % 2 === 1;
                const style = familyFallbacks[index % familyFallbacks.length];
                return (
                  <Reveal key={item.id}>
                  <article className="grid gap-8 md:grid-cols-2 items-center">
                    <div className={`relative h-[400px] rounded-2xl overflow-hidden shadow-xl ${style.container} ${isReversed ? "order-1 md:order-2" : ""}`}>
                      {item.image && item.image !== "none" ? (
                        <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="h-32 w-32 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={isReversed ? "order-2 md:order-1" : ""}>
                      <div className="mb-6">
                        <svg className={`h-10 w-10 mb-4 ${style.quote}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify whitespace-pre-line">&quot;{item.contenu}&quot;</p>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{item.nom}</p>
                        {item.role && <p className="text-gray-600">{item.role}</p>}
                      </div>
                    </div>
                  </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Témoignages des bénévoles</h2>
            <p className="text-xl text-gray-600">L&apos;engagement qui enrichit</p>
          </div>

          {loadError ? (
            <p className="text-center text-gray-700">
              Les témoignages n&apos;ont pas pu être chargés. Merci de réessayer dans quelques instants.
            </p>
          ) : benevoles.length === 0 ? (
            <p className="text-center text-gray-600">Aucun témoignage bénévole pour le moment.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benevoles.map((item, index) => (
                <Reveal key={item.id} delay={(index % 3) * 100} className="h-full">
                <article className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`relative h-96 ${benevoleFallbacks[index % benevoleFallbacks.length]}`}>
                    {item.image && item.image !== "none" ? (
                      <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 italic text-justify whitespace-pre-line">&quot;{item.contenu}&quot;</p>
                    <p className="font-semibold text-gray-900">{item.nom}</p>
                    {item.role && <p className="text-sm text-gray-600">{item.role}</p>}
                  </div>
                </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {moments.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Moments partagés</h2>
              <p className="text-xl text-gray-600">Quelques instants de nos événements et actions</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moments.map((moment, index) => (
                <Reveal key={moment.id} delay={(index % 3) * 100} className="h-full">
                  <figure className="group relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src={moment.image}
                      alt={moment.titre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
                      <figcaption className="text-lg font-semibold text-white drop-shadow">
                        {moment.titre}
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-blue-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>Vous aussi, écrivez votre histoire avec l&apos;AAFD</h2>
          <p className="mb-8 text-xl text-blue-100">Rejoignez notre communauté et devenez acteur du changement</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nous-rejoindre" className="inline-block rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-700 transition-colors">
              Devenir bénévole
            </Link>
            <a
              href={HELLOASSO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              Faire un don
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
