import { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/PageHero'
import { Paragraphes, TitreMisEnValeur } from '@/components/TexteMisEnForme'
import { getContenuSite } from '@/lib/firebase/fetchers'
import { ASSOCIATION_FOUNDING_YEAR, HELLOASSO_URL } from '@/lib/siteConfig'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'

export const metadata: Metadata = {
  title: 'Notre association',
  description: "Découvrez l'histoire, la mission et les actions de l'AAFD Val de Saône : depuis 2007, l'accompagnement des familles réfugiées, 100% bénévoles.",
  alternates: { canonical: '/notre-association' },
  openGraph: { title: 'Notre association | AAFD Val de Saône', description: "Depuis 2007, l'accompagnement des familles réfugiées sur le Val de Saône.", url: '/notre-association' },
}

export const revalidate = 60

// Les textes et photos viennent de l'admin (« Pages du site »), voir lib/contenuSite.ts.
export default async function NotreAssociationPage() {
  const contenu = await getContenuSite()

  const actions = [
    {
      surtitre: contenu.asso_action1_surtitre,
      couleurSurtitre: 'text-orange-700',
      titre: contenu.asso_action1_titre,
      texte: contenu.asso_action1_texte,
      photo: contenu.asso_action1_photo,
      classePhoto: 'object-cover',
      bouton: { href: '/vente-plats', label: 'Commander nos plats' },
    },
    {
      surtitre: contenu.asso_action2_surtitre,
      couleurSurtitre: 'text-blue-700',
      titre: contenu.asso_action2_titre,
      texte: contenu.asso_action2_texte,
      photo: contenu.asso_action2_photo,
      classePhoto: 'object-cover',
      bouton: null,
    },
    {
      surtitre: contenu.asso_action3_surtitre,
      couleurSurtitre: 'text-emerald-600',
      titre: contenu.asso_action3_titre,
      texte: contenu.asso_action3_texte,
      photo: contenu.asso_action3_photo,
      classePhoto: 'object-cover object-bottom',
      bouton: null,
    },
  ]

  const accompagnement = [
    {
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      title: contenu.asso_accomp1_titre,
      desc: contenu.asso_accomp1_texte,
    },
    {
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      title: contenu.asso_accomp2_titre,
      desc: contenu.asso_accomp2_texte,
    },
    {
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      title: contenu.asso_accomp3_titre,
      desc: contenu.asso_accomp3_texte,
    },
  ]

  const valeurs = [
    { title: contenu.asso_valeur1_titre, desc: contenu.asso_valeur1_texte },
    { title: contenu.asso_valeur2_titre, desc: contenu.asso_valeur2_texte },
    { title: contenu.asso_valeur3_titre, desc: contenu.asso_valeur3_texte },
  ]

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Notre association"
        description={`Depuis ${ASSOCIATION_FOUNDING_YEAR}, l'AAFD accompagne des familles réfugiées et des jeunes isolés sur le Val de Saône.`}
        imageSrc={contenu.bandeau_notre_association}
        imageAlt="Notre association AAFD"
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <span className="text-blue-900 font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Depuis {ASSOCIATION_FOUNDING_YEAR}</span>
              <h2 className="text-gray-900 mb-6">Notre histoire</h2>
              <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                <Paragraphes texte={contenu.asso_histoire_texte} />
              </div>
            </div>
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={contenu.asso_histoire_photo}
                alt="Notre histoire AAFD"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
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
                  src={contenu.asso_edito_photo}
                  alt={`Portrait de ${contenu.asso_edito_nom}`}
                  fill
                  sizes="(max-width: 768px) 14rem, 18rem"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-b border-r border-blue-900/20 -z-10" />
            </div>

            <div className="flex-1 mt-4 text-center md:text-left">
              <span className="text-blue-900 font-medium tracking-[0.2em] uppercase text-sm mb-6 block">
                {contenu.asso_edito_rubrique}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
                « <TitreMisEnValeur texte={contenu.asso_edito_titre} classeValeur="text-blue-900" /> »
              </h2>
              <div className="max-w-2xl mx-auto md:mx-0 space-y-6 text-gray-600 text-lg leading-relaxed font-normal italic">
                <Paragraphes texte={contenu.asso_edito_texte} />
              </div>
              <div className="mt-10 flex flex-col items-center md:items-start">
                <p className="text-xl font-semibold text-gray-900">{contenu.asso_edito_nom}</p>
                <p className="text-gray-500 font-normal tracking-wide">{contenu.asso_edito_fonction}</p>
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
            {actions.map((action, i) => {
              // Une action sur deux a sa photo a gauche sur ordinateur.
              const photoAGauche = i % 2 === 1
              return (
                <div key={i} className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={photoAGauche ? 'order-1 md:order-2' : undefined}>
                    <span className={`${action.couleurSurtitre} font-bold tracking-widest uppercase text-xs mb-3 block`}>
                      {action.surtitre}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{action.titre}</h3>
                    <div className="prose prose-lg text-gray-600 space-y-4 text-justify">
                      <Paragraphes texte={action.texte} />
                    </div>
                    {action.bouton && (
                      <Button href={action.bouton.href} variant="primary" size="sm" className="mt-6">
                        {action.bouton.label}
                      </Button>
                    )}
                  </div>
                  <div className={`relative h-[380px] rounded-2xl overflow-hidden shadow-xl ${photoAGauche ? 'order-2 md:order-1' : ''}`}>
                    <Image src={action.photo} alt={action.titre} fill className={action.classePhoto} sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                </div>
              )
            })}
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
            {accompagnement.map(({ icon, title, desc }, i) => (
              <div key={i} className="flex items-start gap-5 py-6">
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
              <Image src={contenu.asso_valeurs_photo} alt="Nos valeurs" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div>
              <h2 className="text-gray-900 mb-8">Nos valeurs</h2>
              <div className="space-y-8">
                {valeurs.map(({ title, desc }, i) => (
                  <div key={i} className="flex items-start gap-5">
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
