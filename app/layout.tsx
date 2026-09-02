import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL as siteUrl, GOOGLE_SITE_VERIFICATION } from "@/lib/siteConfig";

// Colore la barre du navigateur sur mobile et l'en-tête de l'application
// installée. Doit rester accordé au theme_color du manifeste.
export const viewport: Viewport = {
  themeColor: "#1f2937",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "AAFD Val de Saône",
  // Sans ça, iOS transforme tout nombre de la page en lien d'appel, y compris
  // les montants et les dates.
  formatDetection: { telephone: false, address: false, email: false },
  title: {
    default: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    template: "%s | AAFD Val de Saône",
  },
  description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 19 ans : soutien administratif, vente de plats cuisinés, événements festifs, cours de français et aide matérielle.",
  keywords: ["association", "familles réfugiées", "Val de Saône", "bénévoles", "aide humanitaire", "AAFD", "solidarité", "réfugiés"],
  authors: [{ name: "AAFD Val de Saône" }],
  creator: "AAFD Val de Saône",
  publisher: "AAFD Val de Saône",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "AAFD Val de Saône",
    title: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 19 ans : vente de plats, événements festifs et aide matérielle.",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: "AAFD Val de Saône - Accompagner les familles réfugiées",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 19 ans.",
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Association humanitaire",
  // Renseigné seulement si la variable existe : une balise de validation vide
  // ferait échouer la vérification dans Google Search Console.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  // Le manifeste rend le site installable ; sans ce lien il est ignoré.
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AAFD",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <html lang="fr">
      <head>
        {/* Police du site : préchargée pour éviter le FOUT au premier rendu. */}
        <link
          rel="preload"
          href="/fonts/DINSchriftRegular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
