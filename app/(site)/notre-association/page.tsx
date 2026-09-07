import { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/PageHero'
import { ASSOCIATION_FOUNDING_YEAR, HELLOASSO_URL } from '@/lib/siteConfig'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'

export const metadata: Metadata = {
  title: 'Notre association',
  description: "Découvrez l'histoire, la mission et les actions de l'AAFD Val de Saône : depuis 2007, l'accompagnement des familles réfugiées, 100% bénévoles.",
  alternates: { canonical: '/notre-association' },
  openGraph: { title: 'Notre association | AAFD Val de Saône', description: "Depuis 2007, l'accompagnement des familles réfugiées sur le Val de Saône.", url: '/notre-association' },
}

export default function NotreAssociationPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Notre association"
        description={`Depuis ${ASSOCIATION_FOUNDING_YEAR}, l'AAFD accompagne des familles réfugiées et des jeunes isolés sur le Val de Saône.`}
        imageSrc="/images/hero_nous_connaitre.webp"
        imageAlt="Notre association AAFD"
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <span className="text-blue-900 font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Depuis {ASSOCIATION_FOUNDING_YEAR}</span>
              <h2 className="text-gray-900 mb-6">Notre histoire</h2>
              <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                <p>
                  Depuis <strong>{ASSOCIATION_FOUNDING_YEAR}</strong>, l&apos;Association d&apos;Aide aux Familles en Difficulté
                  œuvre sur le territoire du Val de Saône pour accompagner les personnes en situation de précarité.
                </p>
                <p>
                  Nous aidons des familles originaires d&apos;<strong>Albanie, du Kosovo, de Bosnie, d&apos;Arménie,
                  d&apos;Algérie, de Guinée, de République Démocratique du Congo</strong> et d&apos;autres pays.
                </p>
                <p>
                  Nos bénévoles accompagnent également des <strong>jeunes isolés</strong> localisés sur le Val de Saône
                  dans les difficultés matérielles ou administratives qu&apos;ils rencontrent au quotidien.
                </p>
              </div>
            </div>
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/distribution.webp"
                alt="Notre histoire AAFD"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">
            <div className="relative group w-56 md:w-72 flex-shrink-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-lg">
                <Image
                  src="/images/hero_actu.webp"
                  alt="Portrait de la Présidente"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-b border-r border-blue-900/20 -z-10" />
            </div>

            <div className="flex-1 mt-4 text-center md:text-left">
              <span className="text-blue-900 font-medium tracking-[0.2em] uppercase text-sm mb-6 block">
                L&apos;édito de la présidente
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
                « Au cœur de notre engagement,{' '}
                <span className="text-blue-900">l&apos;humain avant tout.</span> »
              </h2>
              <div className="max-w-2xl mx-auto md:mx-0 space-y-6 text-gray-600 text-lg leading-relaxed font-normal italic">
                <p>
                  Depuis {ASSOCIATION_FOUNDING_YEAR}, l&apos;AAFD n&apos;est pas seulement une structure d&apos;aide, c&apos;est un trait d&apos;union.
                  Nous ne nous contentons pas d&apos;accompagner, nous tissons des liens de fraternité qui
                  dépassent les frontières et les parcours de vie.
                </p>
                <p>
                  Chaque rencontre est une leçon de courage, chaque projet une pierre ajoutée à notre édifice
                  commun du Val de Saône. Nous vous invitons à partager cette aventure humaine avec nous.
                </p>
              </div>
              <div className="mt-10 flex flex-col items-center md:items-start">
                <p className="text-xl font-semibold text-gray-900">[Prénom Nom]</p>
                <p className="text-gray-500 font-normal tracking-wide">Présidente de l&apos;AAFD</p>
                <div className="mt-4 w-12 h-px bg-blue-900/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900">Nos actions</h2>
            <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
              Des événements tout au long de l&apos;année pour créer du lien, sensibiliser et récolter des fonds
            </p>
          </div>

          <div className="space-y-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-orange-700 font-bold tracking-widest uppercase text-xs mb-3 block">Environ tous les 2 mois</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ventes de plats traditionnels</h3>
                <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                  <p>
                    Environ tous les deux mois, nous organisons des <strong>ventes de plats traditionnels</strong> cuisinés
                    par les familles que nous accompagnons.
                  </p>
                  <p>
                    Une occasion de découvrir les saveurs d&apos;<strong>Albanie, du Kosovo, de Bosnie, d&apos;Arménie,
                    d&apos;Algérie, de Guinée</strong> et d&apos;autres pays, tout en soutenant concrètement nos actions.
                  </p>
                </div>
                <Button href="/vente-plats" variant="primary" size="sm" className="mt-6">
                  Commander nos plats
                </Button>
              </div>
              <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/images/plats.webp" alt="Ventes de plats" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
                <Image src="/images/evenement.webp" alt="Événements festifs" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="order-1 md:order-2">
                <span className="text-blue-700 font-bold tracking-widest uppercase text-xs mb-3 block">Tout au long de l&apos;année</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Événements festifs et sportifs</h3>
                <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                  <p>
                    Tout au long de l&apos;année, nous organisons des <strong>événements conviviaux</strong> qui
                    rassemblent habitants du Val de Saône, familles réfugiées et sympathisants.
                  </p>
                  <p>
                    Ces moments festifs permettent de créer du lien et de sensibiliser le grand public à la question
                    de l&apos;immigration dans une ambiance chaleureuse.
                  </p>
                  <p>
                    Les fonds récoltés sont intégralement reversés pour financer l&apos;aide matérielle aux familles :
                    transports, assurances, frais d&apos;avocats, hébergement...
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-3 block">Engagement territorial</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Nettoyons notre Val de Saône</h3>
                <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                  <p>
                    Au-delà de l&apos;aide aux familles, nous sommes engagés pour notre territoire à travers des
                    <strong> actions de nettoyage</strong> participatives.
                  </p>
                  <p>
                    Ces journées citoyennes permettent de rassembler habitants et familles autour d&apos;un projet commun :
                    <strong> préserver notre cadre de vie</strong>.
                  </p>
                  <p>
                    C&apos;est aussi une occasion de montrer que les familles réfugiées sont actrices du territoire
                    et souhaitent contribuer positivement à la vie locale.
                  </p>
                </div>
              </div>
              <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/images/nettoyons_1.webp" alt="Nettoyage Val de Saône" fill className="object-cover object-bottom" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Accompagnement au quotidien</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              L&apos;AAFD agit chaque jour pour aider les familles dans leurs démarches
            </p>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-white/10">
            {[
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Aide aux tâches administratives',
                desc: 'Aide aux démarches administratives de nos familles et accompagnement aux rendez-vous officiels.',
              },
              {
                icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
                title: 'Logements',
                desc: 'Recherche de logements et aide au financement des cautions et des loyers.',
              },
              {
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                title: 'Scolarité des enfants',
                desc: 'Suivi de la scolarité des enfants et lien avec les établissements du Val de Saône.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-5 py-6">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-orange-700/20">
                  <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image src="/images/ensemble.webp" alt="Nos valeurs" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-gray-900 mb-8">Nos valeurs</h2>
              <div className="space-y-8">
                {[
                  { title: 'Solidarité', desc: 'Nous croyons en l\'importance de l\'entraide et du soutien mutuel pour construire une société plus juste.' },
                  { title: 'Respect', desc: 'Chaque personne est unique et mérite d\'être traitée avec dignité, quelles que soient ses origines.' },
                  { title: 'Participation', desc: 'Les jeunes et les familles sont associés et participent activement aux événements de l\'association.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white text-lg font-bold">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Envie de vous impliquer ?"
        description="Rejoignez notre équipe de bénévoles ou soutenez nos actions par un don"
      >
        <Button href="/nous-rejoindre" variant="primary" size="lg">
          Devenir bénévole
        </Button>
        <Button
          href={HELLOASSO_URL}
          variant="onDark"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Faire un don
        </Button>
      </CtaBand>
    </main>
  )
}
