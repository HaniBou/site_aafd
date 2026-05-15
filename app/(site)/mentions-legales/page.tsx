import { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Mentions légales du site de l'AAFD Val de Saône, Association d'Aide aux Familles en Difficulté.",
  alternates: { canonical: '/mentions-legales' },
  robots: { index: false, follow: false },
}

export default function MentionsLegalesPage() {
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

            {/* 1. Éditeur */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              <p>Le présent site est édité par :</p>
              <ul className="list-none pl-0 space-y-1 mt-3">
                <li><strong>Dénomination :</strong> Association d&apos;Aide aux Familles en Difficulté (AAFD Val de Saône)</li>
                <li><strong>Forme juridique :</strong> Association loi 1901 à but non lucratif</li>
                <li>
                  <strong>Siège social :</strong>{' '}
                  <span className="text-orange-600 font-semibold">[Adresse du siège social à compléter]</span>
                </li>
                <li>
                  <strong>Numéro RNA / SIRET :</strong>{' '}
                  <span className="text-orange-600 font-semibold">[Numéro à compléter]</span>
                </li>
                <li>
                  <strong>Téléphone :</strong>{' '}
                  <a href="tel:+33612345678" className="text-blue-900 hover:underline">06 12 34 56 78</a>
                </li>
                <li>
                  <strong>Email :</strong>{' '}
                  <a href="mailto:aafd@gmx.fr" className="text-blue-900 hover:underline">aafd@gmx.fr</a>
                </li>
              </ul>
            </div>

            {/* 2. Directeur de publication */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Directeur de publication</h2>
              <p>
                Le directeur de publication est{' '}
                <span className="text-orange-600 font-semibold">[Prénom Nom, Présidente de l&apos;AAFD]</span>.
              </p>
            </div>

            {/* 3. Hébergeur */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <ul className="list-none pl-0 space-y-1 mt-3">
                <li><strong>Société :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 Pine Street, Suite 1200, San Francisco, CA 94104, États-Unis</li>
                <li><strong>Site web :</strong> vercel.com</li>
              </ul>
            </div>

            {/* 4. Propriété intellectuelle */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
              <p>
                Les textes et le logo de ce site sont la propriété de l&apos;AAFD Val de Saône et sont
                protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
                Toute reproduction sans autorisation préalable écrite est interdite.
              </p>
              <p className="mt-3">
                La majorité des photographies utilisées sur ce site proviennent de{' '}
                <strong>Pexels</strong> (pexels.com), plateforme de photos libres de droits,
                et sont utilisées conformément à la licence Pexels.
              </p>
            </div>

            {/* 5. Données personnelles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Protection des données personnelles</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement (UE) 2016/679)
                et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d&apos;un droit
                d&apos;accès, de rectification et de suppression des données vous concernant.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Données collectées</h3>
              <p>Ce site collecte les données que vous nous transmettez volontairement via :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Le <strong>formulaire de contact</strong> : nom, adresse e-mail, message.
                  Ces données sont utilisées exclusivement pour répondre à votre demande.
                </li>
                <li>
                  Le <strong>formulaire de réservation de plats</strong> : nom, adresse e-mail,
                  quantités commandées. Ces données servent uniquement à traiter et confirmer votre commande.
                </li>
              </ul>
              <p className="mt-3">
                Ces données sont transmises via <strong>Resend</strong> (service d&apos;envoi d&apos;e-mails)
                et stockées temporairement sur <strong>Firebase</strong> (Google). Elles ne sont jamais
                cédées à des tiers à des fins commerciales.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Durée de conservation</h3>
              <p>
                Les données du formulaire de contact sont conservées le temps nécessaire au traitement
                de votre demande, puis supprimées. Les données de réservation de plats sont supprimées
                à l&apos;issue de chaque vente.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Vos droits</h3>
              <p>
                Pour exercer vos droits (accès, rectification, suppression, opposition), contactez-nous à{' '}
                <a href="mailto:aafd@gmx.fr" className="text-blue-900 hover:underline">aafd@gmx.fr</a>.
                En cas de difficulté, vous pouvez adresser une réclamation à la{' '}
                <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Cookies</h3>
              <p>
                Ce site n&apos;utilise pas de cookies de traçage ou d&apos;analyse. Seuls des cookies
                strictement nécessaires au fonctionnement du site peuvent être déposés.
              </p>
            </div>

            {/* 6. Liens hypertextes */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens vers des sites tiers. L&apos;AAFD Val de Saône ne saurait
                être tenue responsable du contenu de ces sites ou des pratiques de confidentialité de
                leurs éditeurs.
              </p>
            </div>

            {/* 7. Droit applicable */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige,
                les tribunaux français seront seuls compétents.
              </p>
            </div>

            <p className="text-sm text-gray-400 border-t pt-6">
              Dernière mise à jour : mai 2026
            </p>

          </div>
        </div>
      </section>
    </main>
  )
}
