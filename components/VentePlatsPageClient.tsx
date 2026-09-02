"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReservationModal from "@/components/ReservationModal";
import { PageHero } from "@/components/PageHero";
import PlatCard from "@/components/PlatCard";
import type { Plat, Vente } from "@/types";
import { Reveal } from "@/components/Reveal";
import { formatDateHeure, formatDateJour } from "@/lib/vente";
import { HELLOASSO_URL } from "@/lib/siteConfig";

type Props = {
  vente: Vente | null;
  plats: Plat[];
  prochaineVente: Vente | null;
  commandesOuvertes: boolean;
  loadError?: boolean;
};

const PLAT_ICONS = ["🍝", "🥘", "🍰", "🍲", "🥗", "🍛", "🍕", "🥙"];

export default function VentePlatsPageClient({
  vente,
  plats,
  prochaineVente,
  commandesOuvertes,
  loadError = false,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlat, setSelectedPlat] = useState<Plat | null>(null);

  const openModal = (plat: Plat) => {
    setSelectedPlat(plat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlat(null);
  };

  return (
    <main className="min-h-screen">
      <PageHero
        title="Nos Plats Cuisinés"
        description="Nos bénévoles préparent plusieurs fois par an des plats faits maison que vous pouvez réserver.
            En achetant nos plats, vous soutenez directement les actions de l'AAFD"
        imageSrc="/images/hero_plats.webp"
        imageAlt="Nos plats cuisinés"
        accentColor="bg-orange-400"
      />

      {!loadError && !vente && (
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <div className="w-12 h-0.5 bg-orange-500 mb-6" />
                <h2 className="text-gray-900">
                  {prochaineVente
                    ? 'La prochaine vente se prépare'
                    : 'Aucune vente n’est ouverte en ce moment'}
                </h2>
                <p className="text-body-large text-gray-600 max-w-xl">
                  Nos bénévoles cuisinent plusieurs fois par an, à l&apos;occasion d&apos;une date de
                  retrait précise. Les plats et les réservations sont publiés sur cette page quelques
                  semaines avant chaque vente.
                </p>

                {prochaineVente && (
                  <div className="mt-8 border-l-2 border-orange-500 pl-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                      Prochaine vente
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{prochaineVente.titre}</p>
                    {prochaineVente.dateRetrait && (
                      <p className="mt-1 text-lg text-gray-700">
                        Retrait le {formatDateJour(prochaineVente.dateRetrait)}
                        {prochaineVente.lieuRetrait && <> — {prochaineVente.lieuRetrait}</>}
                      </p>
                    )}
                    <p className="mt-2 text-gray-600">
                      Les réservations ouvriront ici quelques jours avant.
                    </p>
                  </div>
                )}

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/actualites"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-orange-700"
                  >
                    Suivre nos actualités
                    <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a
                    href={HELLOASSO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:bg-pink-700 hover:shadow-2xl"
                  >
                    Faire un don
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/plats.webp"
                    alt="Plats cuisinés préparés par les bénévoles de l'AAFD"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-6 right-6 text-white text-lg font-medium drop-shadow-lg">
                    Chaque plat vendu finance l&apos;accompagnement des familles.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {(loadError || vente) && (
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {loadError ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-700 mb-4">Les plats n&apos;ont pas pu être chargés</p>
              <p className="text-lg text-gray-600">Merci de réessayer dans quelques instants ou de nous contacter.</p>
            </div>
          ) : vente && (
            <>
              <div className="mx-auto max-w-3xl text-center mb-10">
                <span
                  className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
                    commandesOuvertes
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {commandesOuvertes ? 'Réservations ouvertes' : 'Réservations closes'}
                </span>
                <h2 className="mt-4 text-gray-900">{vente.titre}</h2>
                {vente.message && (
                  <p className="text-body-large text-gray-600">{vente.message}</p>
                )}
              </div>

              {vente.dateLimiteCommande && (
                <div className="mx-auto max-w-xl mb-12 rounded-2xl bg-white border border-gray-200 p-5 shadow-sm text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                    {commandesOuvertes ? 'Réservez avant le' : 'Les réservations étaient ouvertes jusqu’au'}
                  </p>
                  <p className="font-semibold text-gray-900">{formatDateHeure(vente.dateLimiteCommande)}</p>
                </div>
              )}

              {!commandesOuvertes && (
                <div className="mx-auto max-w-3xl mb-10 rounded-2xl bg-amber-50 border border-amber-200 px-6 py-5 text-center">
                  <p className="font-semibold text-amber-900">
                    Les réservations pour cette vente sont closes.
                  </p>
                  <p className="text-amber-800 mt-1">
                    Si vous avez commandé, rendez-vous {vente.dateRetrait ? `le ${formatDateJour(vente.dateRetrait)}` : 'à la date convenue'}
                    {vente.lieuRetrait ? ` — ${vente.lieuRetrait}` : ''}.
                  </p>
                </div>
              )}

              {plats.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">Les plats de cette vente arrivent très bientôt.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-8 justify-center">
                  {plats.map((plat, index) => (
                    <Reveal
                      key={plat.id}
                      delay={(index % 3) * 100}
                      className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
                    >
                      <PlatCard
                        plat={plat}
                        onReserve={openModal}
                        reservationOuverte={commandesOuvertes}
                        iconFallback={PLAT_ICONS[index % PLAT_ICONS.length]}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      )}

      {!loadError && (
        <section className="py-16 bg-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-12 sm:text-4xl">
              Comment ça marche ?
            </h2>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  titre: 'Choisissez votre plat',
                  texte: vente
                    ? 'Parcourez les plats de la vente et cliquez sur « Réserver ce plat »'
                    : 'Dès qu’une vente est ouverte, les plats s’affichent sur cette page',
                },
                {
                  titre: 'Réservez en ligne',
                  texte: vente?.dateLimiteCommande
                    ? `Remplissez le formulaire avec vos coordonnées, avant le ${formatDateJour(vente.dateLimiteCommande)}`
                    : 'Remplissez le formulaire avec vos coordonnées, avant la date limite',
                },
                {
                  titre: 'Venez retirer',
                  texte: vente?.dateRetrait
                    ? `Récupérez votre plat le ${formatDateJour(vente.dateRetrait)} et réglez sur place`
                    : 'Récupérez votre plat le jour du retrait et réglez sur place',
                },
              ].map((etape, i) => (
                <Reveal key={etape.titre} delay={i * 130}>
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-4xl font-bold text-white">{i + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{etape.titre}</h3>
                    <p className="text-gray-700 leading-relaxed">{etape.texte}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {vente?.lieuRetrait && (
              <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Lieu de retrait</h3>
                <p className="text-lg text-gray-700 text-center">{vente.lieuRetrait}</p>
                {vente.dateRetrait && (
                  <p className="text-center text-gray-600 mt-2">{formatDateHeure(vente.dateRetrait)}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {isModalOpen && selectedPlat && (
        <ReservationModal
          key={selectedPlat.id}
          isOpen
          plat={selectedPlat}
          vente={vente}
          onClose={closeModal}
        />
      )}

      <section className="py-16 bg-blue-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>Une question sur nos plats ?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            N&apos;hésitez pas à nous contacter pour plus d&apos;informations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
