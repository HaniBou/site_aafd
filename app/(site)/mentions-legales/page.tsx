import { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { TexteStructure } from '@/components/TexteMisEnForme'
import { getContenuSite } from '@/lib/firebase/fetchers'
import { lienTelephone } from '@/lib/contenuSite'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Mentions légales du site de l'AAFD Val de Saône, Association d'Aide aux Familles en Difficulté.",
  alternates: { canonical: '/mentions-legales' },
  robots: { index: false, follow: false },
}

// Les textes viennent de l'admin (« Pages du site » > Mentions légales), voir
// lib/contenuSite.ts. Une rubrique laissee vide est retiree et les suivantes
// sont renumerotees.
export default async function MentionsLegalesPage() {
  const contenu = await getContenuSite()
  const email = contenu.contact_email
  const telephone = contenu.contact_telephone

  const rubriques = [
    { titre: contenu.ml_editeur_titre, texte: contenu.ml_editeur_texte, coordonnees: true },
    { titre: contenu.ml_publication_titre, texte: contenu.ml_publication_texte },
    { titre: contenu.ml_hebergement_titre, texte: contenu.ml_hebergement_texte },
    { titre: contenu.ml_propriete_titre, texte: contenu.ml_propriete_texte },
    { titre: contenu.ml_donnees_titre, texte: contenu.ml_donnees_texte },
    { titre: contenu.ml_cookies_titre, texte: contenu.ml_cookies_texte },
    { titre: contenu.ml_liens_titre, texte: contenu.ml_liens_texte },
    { titre: contenu.ml_droit_titre, texte: contenu.ml_droit_texte },
  ].filter(rubrique => rubrique.texte)

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Mentions légales"
        description="Informations légales relatives au site de l'AAFD Val de Saône"
        imageSrc="/images/hero_nous_connaitre.webp"
        imageAlt="Mentions légales"
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-gray-600 space-y-12">

            {rubriques.map((rubrique, i) => (
              <div key={i}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{i + 1}. {rubrique.titre}</h2>
                <TexteStructure texte={rubrique.texte.replaceAll('[email]', email)} />
                {rubrique.coordonnees && (
                  <p>
                    {telephone && (
                      <>
                        <strong>Téléphone :</strong>{' '}
                        <a href={lienTelephone(telephone)} className="text-blue-900 hover:underline">{telephone}</a>
                        <br />
                      </>
                    )}
                    <strong>Email :</strong>{' '}
                    <a href={`mailto:${email}`} className="text-blue-900 hover:underline">{email}</a>
                  </p>
                )}
              </div>
            ))}

            {contenu.ml_mise_a_jour && (
              <p className="text-sm text-gray-600 border-t pt-6">
                Dernière mise à jour : {contenu.ml_mise_a_jour}
              </p>
            )}

          </div>
        </div>
      </section>
    </main>
  )
}
