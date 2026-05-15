import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: {
    absolute: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
  },
  description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 17 ans : vente de plats cuisinés, événements festifs, cours de français et aide matérielle. 100% bénévoles.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 17 ans : vente de plats, événements festifs et aide matérielle.",
    url: '/',
  },
}

export default function HomePage() {
  return <HomePageClient />
}
