import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingDonButton } from "@/components/FloatingDonButton";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  INSTAGRAM_URL,
  ASSOCIATION_NAME,
  ASSOCIATION_FULL_NAME,
  HELLOASSO_URL,
} from "@/lib/siteConfig";

// Décrit l'association pour Google : nom, logo, contacts, comptes officiels.
// Uniquement sur les pages publiques, jamais dans l'admin.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: `${ASSOCIATION_NAME} Val de Saône`,
  alternateName: ASSOCIATION_FULL_NAME,
  description:
    "Association loi 1901 qui accompagne les familles réfugiées sur le Val de Saône : soutien administratif, vente de plats cuisinés, événements festifs, cours de français et aide matérielle.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/test-logo.webp`,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  areaServed: "Val de Saône, France",
  sameAs: [INSTAGRAM_URL, HELLOASSO_URL],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={organizationSchema} />
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
