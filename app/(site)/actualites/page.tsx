import type { Metadata } from 'next'
import ActualitesPageClient from '@/components/ActualitesPageClient'
import { getActualitesAdmin, getPhotosSite } from '@/lib/firebase/fetchers'
import type { Actualite } from '@/types'

export const revalidate = 60

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

export default async function ActualitesPage() {
  let actualites: Actualite[] = []
  let loadError = false
  const photosPromise = getPhotosSite()

  try {
    actualites = await getActualitesAdmin()
  } catch (error) {
    console.error('[actualites] chargement des actualités', error)
    loadError = true
  }

  const { bandeau_actualites } = await photosPromise
  return (
    <ActualitesPageClient
      actualites={actualites}
      photoBandeau={bandeau_actualites}
      loadError={loadError}
    />
  )
}
