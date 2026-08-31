import type { Metadata } from 'next'
import TemoignagesPageClient from '@/components/TemoignagesPageClient'
import { getTemoignagesAdmin, getMomentsAdmin } from '@/lib/firebase/fetchers'
import type { Temoignage, Moment } from '@/types'

export const revalidate = 60

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

export default async function TemoignagesPage() {
  let temoignages: Temoignage[] = []
  let moments: Moment[] = []
  let loadError = false

  try {
    const [temoins, photos] = await Promise.all([
      getTemoignagesAdmin(),
      getMomentsAdmin(),
    ])
    temoignages = temoins
    // On n'affiche que les photos réellement exploitables.
    moments = photos.filter(moment => moment.image && moment.image !== 'none')
  } catch (error) {
    console.error('[temoignages] chargement des données', error)
    loadError = true
  }

  return (
    <TemoignagesPageClient
      temoignages={temoignages}
      moments={moments}
      loadError={loadError}
    />
  )
}
