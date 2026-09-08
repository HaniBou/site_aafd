import { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  ASSOCIATION_ADDRESS,
  ASSOCIATION_NAME,
  ASSOCIATION_FULL_NAME,
} from '@/lib/siteConfig'

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

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              <p>Le présent site est édité par :</p>
              <ul className="list-none pl-0 space-y-1 mt-3">
                <li>
                  <strong>Dénomination :</strong> {ASSOCIATION_FULL_NAME}{' '}
                  ({ASSOCIATION_NAME} Val de Saône)
                </li>
                <li><strong>Forme juridique :</strong> Association loi 1901 à but non lucratif</li>
                <li>
                  <strong>Siège social :</strong>{' '}
                  {ASSOCIATION_ADDRESS.streetAddress}, {ASSOCIATION_ADDRESS.postalCode}{' '}
                  {ASSOCIATION_ADDRESS.addressLocality}
                </li>
                <li>
                  <strong>Numéro RNA :</strong> W691069843
                </li>
                <li>
                  <strong>Numéro SIRET :</strong> 504 653 833 00013
                </li>
                <li>
                  <strong>Téléphone :</strong>{' '}
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-blue-900 hover:underline">{CONTACT_PHONE}</a>
                </li>
                <li>
                  <strong>Email :</strong>{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-900 hover:underline">{CONTACT_EMAIL}</a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Directrice de la publication</h2>
              <p>
                La directrice de la publication est{' '}
                <strong>Marie Claude ACKER</strong>, en sa qualité de présidente
                de l&apos;association.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <ul className="list-none pl-0 space-y-1 mt-3">
                <li><strong>Société :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 Pine Street, Suite 1200, San Francisco, CA 94104, États-Unis</li>
                <li><strong>Site web :</strong> vercel.com</li>
              </ul>
            </div>

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
              <p className="mt-3">
                Une <strong>mesure de fréquentation anonyme</strong> est par ailleurs réalisée,
                sans cookie et sans donnée personnelle (voir la section 6 ci-dessous).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Bases légales</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Formulaires de contact et de réservation : exécution de mesures précontractuelles
                  et intérêt légitime de l&apos;association à répondre à votre demande.
                </li>
                <li>
                  Mesure de fréquentation : intérêt légitime de l&apos;association à connaître
                  l&apos;usage de son site, au moyen de statistiques anonymes.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Durée de conservation</h3>
              <p>
                Les données du formulaire de contact sont conservées le temps nécessaire au traitement
                de votre demande, puis supprimées. Les données de réservation de plats sont supprimées
                à l&apos;issue de chaque vente.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Vos droits</h3>
              <p>
                Pour exercer vos droits (accès, rectification, suppression, opposition), contactez-nous à{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-900 hover:underline">{CONTACT_EMAIL}</a>.
                En cas de difficulté, vous pouvez adresser une réclamation à la{' '}
                <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés).
              </p>
            </div>

            <div id="cookies" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
              <p>
                Ce site <strong>n&apos;utilise aucun cookie publicitaire, de traçage ou de
                mesure d&apos;audience tierce</strong>. Il ne fait appel à aucun service
                d&apos;analyse externe : ni Google Analytics, ni équivalent. C&apos;est pourquoi
                aucune bannière de consentement ne vous est présentée.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                Cookies strictement nécessaires
              </h3>
              <p>
                Un seul cookie est susceptible d&apos;être déposé, exempté de consentement car
                indispensable au fonctionnement du site :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <code>admin_session</code> — maintient la connexion à l&apos;espace bénévoles.
                  Déposé uniquement après authentification d&apos;un membre de l&apos;association.
                  Les visiteurs du site public ne le reçoivent jamais.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                Compteur de fréquentation anonyme
              </h3>
              <p>
                L&apos;association utilise son propre compteur de visites, hébergé avec le site
                et sans aucun service tiers. Seuls des <strong>totaux</strong> sont enregistrés :
                nombre de visites par jour, nombre de consultations par page, et nom de domaine
                du site par lequel vous êtes arrivé (par exemple « Google » ou « Instagram »).
              </p>
              <p className="mt-3">
                Aucune adresse IP, aucun identifiant de visiteur, aucun parcours individuel et
                aucune adresse complète de provenance ne sont conservés. Ces statistiques ne
                permettent pas de vous identifier, ne sont recoupées avec aucun autre traitement
                et ne sont transmises à personne.
              </p>
              <p className="mt-3">
                Un simple marqueur technique (<code>aafd_visite_comptee</code>) est placé dans la
                mémoire de session de votre navigateur, uniquement pour ne pas compter deux fois
                la même visite. Il ne contient aucune valeur identifiante et disparaît dès la
                fermeture de l&apos;onglet.
              </p>
              <p className="mt-3">
                Strictement limitée à la production de statistiques anonymes pour le seul compte
                de l&apos;association, cette mesure relève de l&apos;exemption de consentement
                prévue par la CNIL pour la mesure d&apos;audience. Vous pouvez néanmoins vous y
                opposer en nous écrivant à{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-900 hover:underline">{CONTACT_EMAIL}</a>,
                ou en paramétrant votre navigateur pour bloquer le stockage local.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens vers des sites tiers. L&apos;AAFD Val de Saône ne saurait
                être tenue responsable du contenu de ces sites ou des pratiques de confidentialité de
                leurs éditeurs.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige,
                les tribunaux français seront seuls compétents.
              </p>
            </div>

            <p className="text-sm text-gray-600 border-t pt-6">
              Dernière mise à jour : septembre 2026
            </p>

          </div>
        </div>
      </section>
    </main>
  )
}
