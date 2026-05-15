import type { Metadata } from 'next'
import VentePlatsPageClient from '@/components/VentePlatsPageClient'

export const metadata: Metadata = {
  title: 'Vente de plats',
  description: "Réservez des plats cuisinés maison préparés par les bénévoles de l'AAFD Val de Saône. Chaque achat soutient directement les familles réfugiées.",
  alternates: {
    canonical: '/vente-plats',
  },
  openGraph: {
    title: 'Vente de plats cuisinés | AAFD Val de Saône',
    description: "Réservez des plats cuisinés maison préparés par les bénévoles de l'AAFD. Chaque achat soutient directement les familles réfugiées.",
    url: '/vente-plats',
  },
}

export default function VentePlatsPage() {
  return <VentePlatsPageClient />
}
