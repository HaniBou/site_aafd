import type { Metadata } from 'next'
import ActualitesPageClient from '@/components/ActualitesPageClient'

export const metadata: Metadata = {
  title: 'Actualités',
  description: "Suivez les actions, événements et témoignages de l'AAFD Val de Saône tout au long de l'année. Ventes de plats, collectes, événements festifs.",
  alternates: {
    canonical: '/actualites',
  },
  openGraph: {
    title: 'Actualités | AAFD Val de Saône',
    description: "Suivez les actions, événements et témoignages de l'AAFD Val de Saône tout au long de l'année.",
    url: '/actualites',
  },
}

export default function ActualitesPage() {
  return <ActualitesPageClient />
}
