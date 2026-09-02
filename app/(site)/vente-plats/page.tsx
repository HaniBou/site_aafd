import type { Metadata } from 'next'
import VentePlatsPageClient from '@/components/VentePlatsPageClient'
import {
  getVenteEnCours,
  getPlatsByVenteAdmin,
  getProchaineVenteAnnoncee,
} from '@/lib/firebase/fetchers'
import { venteEstOuverte } from '@/lib/vente'
import type { Plat, Vente } from '@/types'

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
  let vente: Vente | null = null
  let plats: Plat[] = []
  let prochaineVente: Vente | null = null
  let loadError = false

  try {
    vente = await getVenteEnCours()
    if (vente) {
      plats = await getPlatsByVenteAdmin(vente.id)
    } else {
      prochaineVente = await getProchaineVenteAnnoncee()
    }
  } catch (error) {
    console.error('[vente-plats] chargement de la vente', error)
    loadError = true
  }

  return (
    <VentePlatsPageClient
      vente={vente}
      plats={plats}
      prochaineVente={prochaineVente}
      commandesOuvertes={venteEstOuverte(vente)}
      loadError={loadError}
    />
  )
}
