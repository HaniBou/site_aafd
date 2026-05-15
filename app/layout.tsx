import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-aafd.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    template: "%s | AAFD Val de Saône",
  },
  description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 17 ans : soutien administratif, vente de plats cuisinés, événements festifs, cours de français et aide matérielle.",
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
    description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 17 ans : vente de plats, événements festifs et aide matérielle.",
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
    description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 17 ans.",
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
