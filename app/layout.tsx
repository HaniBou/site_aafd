import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { FloatingDonButton } from "@/components/FloatingDonButton";
import { StickyBar } from "@/components/StickyBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
  description: "Accompagnement des familles réfugiées sur le Val de Saône depuis 17 ans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        {/* FloatingDonButton: visible uniquement sur desktop */}
        <div className="hidden md:block">
          <FloatingDonButton />
        </div>
        {/* StickyBar: visible uniquement sur mobile
        <div className="block md:hidden">
          <StickyBar />
        </div> */}
      </body>
    </html>
  );
}
