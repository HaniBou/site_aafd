import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'
import { getActualitesAdmin, getPlatsAdmin } from '@/lib/firebase/fetchers'
import type { Actualite, Plat } from '@/types'

export const revalidate = 60

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

export default async function HomePage() {
  let actualites: Actualite[] = []
  let platsDuMoment: Plat[] = []

  try {
    const [actus, plats] = await Promise.all([getActualitesAdmin(), getPlatsAdmin()])
    actualites = actus
    // On ne met en avant que ce qui est réellement commandable.
    platsDuMoment = plats
      .filter(plat => !plat.cloture && plat.quantite > 0)
      .slice(0, 3)
  } catch (error) {
    console.error('[accueil] chargement des données', error)
  }

  return <HomeContent actualites={actualites} platsDuMoment={platsDuMoment} />
}
