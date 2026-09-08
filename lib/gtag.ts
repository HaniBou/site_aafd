// Pont minimal vers gtag.js (Google Analytics 4).
//
// Le script Google n'est charge qu'apres consentement (voir components/Analytics.tsx),
// mais on declare quand meme le Consent Mode v2 : si l'internaute retire son
// accord en cours de visite, la librairie deja chargee cesse d'ecrire des cookies.

import { GA_MEASUREMENT_ID } from '@/lib/siteConfig'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Cree le tampon `dataLayer` et la fonction `gtag` si gtag.js n'est pas encore
 * charge. C'est le snippet officiel de Google : les appels passes avant le
 * chargement sont mis en file et rejoues dans l'ordre.
 */
function ensureGtag(): NonNullable<Window['gtag']> {
  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
  }

  return window.gtag
}

/**
 * Declare les refus par defaut. A pousser avant toute commande `config`.
 * L'association ne fait pas de publicite : les signaux publicitaires restent
 * refuses en permanence.
 */
export function setDefaultConsent(): void {
  const gtag = ensureGtag()
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  })
  gtag('set', 'ads_data_redaction', true)
}

/** Repercute le choix de l'internaute sur la mesure d'audience. */
export function updateAnalyticsConsent(granted: boolean): void {
  ensureGtag()('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

/**
 * Initialise la propriete GA4. `send_page_view: false` parce que l'App Router
 * navigue sans rechargement : les vues sont envoyees a la main par
 * `trackPageView` pour ne pas manquer les changements de route.
 */
export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID) return

  const gtag = ensureGtag()
  const secure = window.location.protocol === 'https:' ? ';Secure' : ''

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    cookie_flags: `SameSite=Lax${secure}`,
  })
}

export function trackPageView(path: string): void {
  if (!GA_MEASUREMENT_ID) return

  ensureGtag()('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
