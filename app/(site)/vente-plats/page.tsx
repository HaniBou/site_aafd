import type { Metadata } from 'next'
import VentePlatsPageClient from '@/components/VentePlatsPageClient'
import { getPlatsAdmin } from '@/lib/firebase/fetchers'
import type { Plat } from '@/types'

export const revalidate = 60

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

export default async function VentePlatsPage() {
  let plats: Plat[] = []
  let loadError = false

  try {
    // Les ventes clôturées restent en base pour l'admin, mais ne sont plus
    // proposées au public.
    plats = (await getPlatsAdmin()).filter(plat => !plat.cloture)
  } catch (error) {
    console.error('[vente-plats] chargement des plats', error)
    loadError = true
  }

  return <VentePlatsPageClient plats={plats} loadError={loadError} />
}
