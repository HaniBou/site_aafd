import Link from 'next/link'
import Image from 'next/image'
import { MainHero } from '@/components/MainHero'
import { getCategoryStyles } from '@/lib/categoryStyles'
import type { Actualite, Plat } from '@/types'
import { actualiteHref } from '@/lib/slug'
import { ASSOCIATION_FOUNDING_YEAR, HELLOASSO_URL } from '@/lib/siteConfig'
import { Reveal } from '@/components/Reveal'
import { CountUp } from '@/components/CountUp'

export default function HomeContent({
  actualites,
  platsDuMoment,
}: {
  actualites: Actualite[];
  platsDuMoment: Plat[];
}) {
  const featuredActu =
    actualites.find(actu => actu.aLaUne === true) ??
    [...actualites].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0] ??
    null;

  const evenementsAgenda = actualites
    .filter(actu => {
      const isEventCategory = actu.category === "Vente" || actu.category === "Événement";
      const eventDate = new Date(actu.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return isEventCategory && eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <main className="min-h-screen bg-white">
      <MainHero />

      {/* Actualité à la une */}
      {featuredActu && (
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* h2 : sans lui, on saute du h1 du héros au h3 du titre d'article */}
                <h2 className="inline-block px-4 py-2 mb-0 bg-orange-600 text-white text-sm font-medium tracking-wide rounded-full">
                  À la une
                </h2>
              </div>
              <Link
                href="/actualites"
                className="group text-blue-700 hover:underline font-medium text-sm transition-colors hidden sm:inline-flex items-center gap-1"
              >
                Voir toutes les actualités
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {featuredActu.image && featuredActu.image !== 'none' ? (
                  <Image
                    src={featuredActu.image}
                    alt={featuredActu.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <svg className="h-24 w-24 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                )}
              </div>

              <div className="p-6 md:p-8">
                <span className={`inline-block px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-full ${getCategoryStyles(featuredActu.category)}`}>
                  {featuredActu.category}
                </span>
                <h3 className="large text-gray-900 mt-3">
                  {featuredActu.title}
                </h3>
                <p className="text-small text-gray-500">
                  {new Date(featuredActu.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600">
                  {truncateText(featuredActu.content, 200)}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={actualiteHref(featuredActu)}
                    className="group inline-flex items-center gap-1 text-blue-700 hover:underline font-semibold text-sm transition-colors"
                  >
                    Lire la suite
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {featuredActu.category === "Vente" && (
                    <Link
                      href="/vente-plats"
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                      Commander
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Qui sommes-nous */}
      <section>
        <div className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-gray-900 mb-6">Qui sommes-nous ?</h2>
                <div className="prose prose-xl text-gray-600 text-justify space-y-4">
                  <p>
                    Nous accompagnons des <strong>familles réfugiées</strong> originaires d&apos;Albanie, du Kosovo,
                    de Bosnie, d&apos;Arménie, d&apos;Algérie, de Guinée, de République Démocratique du Congo et d&apos;autres pays.
                  </p>
                  <p>
                    Nous soutenons également des <strong>jeunes isolés</strong> localisés sur le Val de Saône
                    dans les difficultés matérielles ou administratives qu&apos;ils rencontrent.
                  </p>
                  <p>
                    Les jeunes et les familles sont <strong>associés et participent</strong> activement à nos événements.
                  </p>
                </div>
                <Link
                  href="/notre-association"
                  className="group mt-6 inline-flex items-center gap-2 text-lg text-blue-700 font-semibold hover:underline"
                >
                  En savoir plus sur notre association
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/v4.webp"
                  alt="L'AAFD en action"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {evenementsAgenda.length > 0 && (
        <section className="py-20 bg-blue-900 text-white">
          <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2>Prochains rendez-vous</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {evenementsAgenda.map((evt, i) => (
                <Reveal key={evt.id} delay={i * 90}>
                <Link
                  href={actualiteHref(evt)}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:border-white/25 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  <div className="bg-orange-600 text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                    <span className="text-3xl font-black leading-none">
                      {new Date(evt.date).getDate()}
                    </span>
                    <span className="text-[11px] uppercase font-bold">
                      {new Date(evt.date).toLocaleDateString("fr-FR", { month: 'short' }).replace('.', '')}
                    </span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-orange-400 text-[11px] font-bold uppercase tracking-wider italic">
                      {evt.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                      {evt.title}
                    </h3>
                  </div>
                  <div className="hidden sm:flex p-3 rounded-full bg-orange-500 group-hover:bg-orange-600 transition-colors shadow-lg shrink-0">
                    <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ce qui nous anime */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900">
              Ce qui nous anime
            </h2>
            <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
              Accompagner, soutenir et créer du lien avec les familles réfugiées
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                image: '/images/help.webp',
                titre: 'Sensibiliser',
                texte: "Sensibiliser sur la question de l'immigration et comprendre les raisons de l'exil",
              },
              {
                image: '/images/v5.webp',
                titre: 'Créer du lien',
                texte: 'Créer des liens amicaux et festifs entre la population locale et les familles réfugiées',
              },
              {
                image: '/images/donate.webp',
                titre: 'Récolter des fonds',
                texte: "Développer l'aide matérielle : transports, assurances, avocats, hébergement...",
              },
            ].map((carte, i) => (
              <Reveal key={carte.titre} delay={i * 110} className="h-full">
                <div className="group h-full rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={carte.image}
                      alt={carte.titre}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 bg-white text-center">
                    <h3 className="text-gray-900">{carte.titre}</h3>
                    <p className="text-gray-600">{carte.texte}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>L&apos;AAFD en chiffres</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              {/* Année affichée telle quelle, sans compteur animé : voir défiler
                  0 → 2007 se lit comme un nombre, pas comme une date. */}
              <div className="mb-2 text-5xl font-bold text-orange-400">{ASSOCIATION_FOUNDING_YEAR}</div>
              <div className="text-lg text-blue-100">année de création</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-400"><CountUp value={10} suffix="+" /></div>
              <div className="text-lg text-blue-100">nationalités accompagnées</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-400"><CountUp value={100} suffix="%" /></div>
              <div className="text-lg text-blue-100">bénévoles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos plats du moment */}
      {platsDuMoment.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-gray-900">Nos plats du moment</h2>
              <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
                Cuisinés par nos bénévoles. Chaque plat acheté finance directement
                l&apos;accompagnement des familles.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {platsDuMoment.map((plat, i) => (
                <Reveal key={plat.id} delay={i * 100} className="h-full">
                  <Link
                    href="/vente-plats"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-orange-100">
                      {plat.image && plat.image !== 'none' ? (
                        <Image
                          src={plat.image}
                          alt={plat.nom}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">🍽️</div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-1 text-gray-900">{plat.nom}</h3>
                      {plat.typeMenu && (
                        <p className="mb-0 text-sm font-semibold text-orange-600">{plat.typeMenu}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-bold text-orange-600">{plat.prix} €</span>
                        <span className="text-xs text-gray-600">
                          {plat.quantite} restant{plat.quantite > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/vente-plats"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-orange-700"
              >
                Voir tous nos plats
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>Rejoignez notre communauté</h2>
          <p className="mb-8 text-xl text-blue-100">
            Que vous souhaitiez devenir bénévole, faire un don ou simplement en savoir plus,
            nous serions ravis de vous accueillir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nous-rejoindre"
              className="inline-block rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-700 transition-colors shadow-lg"
            >
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
  )
}
