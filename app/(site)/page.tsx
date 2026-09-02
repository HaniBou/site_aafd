import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'
import {
  getActualitesAdmin,
  getMomentsAdmin,
  getVenteEnCours,
  getPlatsByVenteAdmin,
} from '@/lib/firebase/fetchers'
import { venteEstOuverte } from '@/lib/vente'
import type { Actualite, Moment, Plat, Vente } from '@/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
  },
  description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 2007 : vente de plats cuisinés, événements festifs, accompagnement administratif et aide matérielle. 100% bénévoles.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    description: "L'AAFD accompagne les familles réfugiées sur le Val de Saône depuis 2007 : vente de plats, événements festifs et aide matérielle.",
    url: '/',
  },
}

export default async function HomePage() {
  let actualites: Actualite[] = []
  let platsDuMoment: Plat[] = []
  let venteEnCours: Vente | null = null
  let moments: Moment[] = []

  try {
    const [actus, vente, momentsGalerie] = await Promise.all([
      getActualitesAdmin(),
      getVenteEnCours(),
      getMomentsAdmin(),
    ])
    actualites = actus
    moments = momentsGalerie

    if (venteEstOuverte(vente)) {
      venteEnCours = vente
      platsDuMoment = (await getPlatsByVenteAdmin(vente!.id))
        .filter(plat => plat.quantite > 0)
        .slice(0, 3)
    }
  } catch (error) {
    console.error('[accueil] chargement des données', error)
  }

  return (
    <HomeContent
      actualites={actualites}
      platsDuMoment={platsDuMoment}
      venteEnCours={venteEnCours}
      moments={moments}
    />
  )
}
