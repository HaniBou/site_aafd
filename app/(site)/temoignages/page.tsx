import type { Metadata } from 'next'
import TemoignagesPageClient from '@/components/TemoignagesPageClient'

export const metadata: Metadata = {
  title: 'Témoignages',
  description: "Découvrez les témoignages des familles réfugiées accompagnées et des bénévoles de l'AAFD Val de Saône. Des histoires de résilience et d'engagement.",
  alternates: {
    canonical: '/temoignages',
  },
  openGraph: {
    title: 'Témoignages | AAFD Val de Saône',
    description: "Découvrez les témoignages des familles réfugiées accompagnées et des bénévoles de l'AAFD Val de Saône.",
    url: '/temoignages',
  },
}

export default function TemoignagesPage() {
  return <TemoignagesPageClient />
}
