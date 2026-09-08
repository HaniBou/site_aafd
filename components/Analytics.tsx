'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { GA_MEASUREMENT_ID } from '@/lib/siteConfig'
import {
  initAnalytics,
  setDefaultConsent,
  trackPageView,
  updateAnalyticsConsent,
} from '@/lib/gtag'
import { clearAnalyticsCookies } from '@/lib/consent'

type AnalyticsProps = {
  /** `true` uniquement si l'internaute a accepté la mesure d'audience. */
  enabled: boolean
}

/**
 * Google Analytics 4, chargé seulement après un consentement explicite.
 *
 * La CNIL ne considère pas GA4 comme exempté de consentement : le script n'est
 * donc pas injecté tant que `enabled` est faux, plutôt que chargé en mode
 * « dégradé ».
 */
export function Analytics({ enabled }: AnalyticsProps) {
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    if (!enabled) {
      // Rien à faire tant que le script n'a jamais été chargé : inutile de
      // créer un dataLayer pour un refus.
      if (!initialized.current) return

      // Retrait du consentement en cours de visite. Démonter la balise <Script>
      // ne décharge pas gtag.js : la mesure améliorée de GA4 (défilement, clics
      // sortants) continuerait d'émettre des requêtes, même sans cookie. Seul un
      // rechargement garantit l'arrêt complet — le choix étant déjà enregistré
      // dans le cookie, la page revient sans aucun script Google.
      updateAnalyticsConsent(false)
      clearAnalyticsCookies()
      window.location.reload()
      return
    }

    if (!initialized.current) {
      setDefaultConsent()
      initAnalytics()
      initialized.current = true
    }
    updateAnalyticsConsent(true)
  }, [enabled])

  useEffect(() => {
    if (!enabled || !GA_MEASUREMENT_ID) return
    // `usePathname` seul suffit ici : aucune page publique ne se distingue par
    // sa seule query string. On la relit quand même pour l'enregistrer.
    trackPageView(pathname + window.location.search)
  }, [enabled, pathname])

  if (!enabled || !GA_MEASUREMENT_ID) return null

  return (
    <Script
      id="ga-lib"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
    />
  )
}

export default Analytics
