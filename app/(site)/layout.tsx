import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingDonButton } from "@/components/FloatingDonButton";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  INSTAGRAM_URL,
  ASSOCIATION_NAME,
  ASSOCIATION_FULL_NAME,
  ASSOCIATION_FOUNDING_YEAR,
  ASSOCIATION_ADDRESS,
  HELLOASSO_URL,
} from "@/lib/siteConfig";

// Décrit l'association pour Google : nom, logo, contacts, comptes officiels.
// Uniquement sur les pages publiques, jamais dans l'admin.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": `${SITE_URL}/#organisation`,
  name: `${ASSOCIATION_NAME} Val de Saône`,
  alternateName: ASSOCIATION_FULL_NAME,
  description:
    "Association loi 1901 qui accompagne les familles réfugiées sur le Val de Saône : soutien administratif, scolarité des enfants, vente de plats cuisinés, événements festifs et aide matérielle.",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE_E164,
  foundingDate: String(ASSOCIATION_FOUNDING_YEAR),
  // Pas de `nonprofitStatus` : l'énumération schema.org ne couvre que les
  // statuts néerlandais, britanniques et américains, rien pour la loi 1901.
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Val de Saône, France",
  },
  knowsLanguage: ["fr-FR"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_E164,
    availableLanguage: ["French"],
  },
  address: { "@type": "PostalAddress", ...ASSOCIATION_ADDRESS },
  sameAs: [INSTAGRAM_URL, HELLOASSO_URL],
};

// Déclare le site lui-même et le rattache à l'association : c'est ce lien qui
// permet à Google d'associer les articles publiés à l'entité « AAFD ».
const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#site`,
  url: SITE_URL,
  name: `${ASSOCIATION_NAME} Val de Saône`,
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE_URL}/#organisation` },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      {/* Sans JavaScript, l'apparition au scroll ne se déclencherait jamais :
          on neutralise l'état masqué pour ne rien rendre invisible. */}
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Header />
      {children}
      <Footer />
      <div className="hidden md:block">
        <FloatingDonButton />
      </div>
    </>
  );
}
