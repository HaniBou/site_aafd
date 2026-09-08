'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/Button'
import { Analytics } from '@/components/Analytics'
import { GA_MEASUREMENT_ID } from '@/lib/siteConfig'
import {
  OPEN_PREFERENCES_EVENT,
  readConsent,
  readConsentOnServer,
  subscribeToConsent,
  writeConsent,
} from '@/lib/consent'

// Le cookie n'existe pas au rendu serveur : tant que l'hydratation n'a pas eu
// lieu, on ne sait pas si l'internaute a déjà répondu. Ce drapeau évite de
// faire clignoter le bandeau chez quelqu'un qui a déjà fait son choix.
const noopSubscribe = () => () => {}
const alwaysTrue = () => true
const alwaysFalse = () => false

/**
 * Bandeau cookies + panneau de préférences + chargement conditionnel de GA4.
 *
 * Trois règles CNIL guident l'implémentation :
 *  - aucun cookie de mesure d'audience avant un clic explicite ;
 *  - refuser doit demander autant d'efforts qu'accepter (un seul clic, deux
 *    boutons de même taille au même niveau) ;
 *  - le choix doit rester révocable à tout moment, d'où le lien « Gérer mes
 *    cookies » du pied de page qui rouvre ce panneau.
 */
export function CookieConsent() {
  const hydrated = useSyncExternalStore(noopSubscribe, alwaysTrue, alwaysFalse)
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, readConsentOnServer)
  const [panelOpen, setPanelOpen] = useState(false)
  const [analyticsDraft, setAnalyticsDraft] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const openPanel = useCallback(() => {
    setAnalyticsDraft(readConsent()?.analytics ?? false)
    setPanelOpen(true)
  }, [])

  useEffect(() => {
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPanel)
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPanel)
  }, [openPanel])

  useEffect(() => {
    if (!panelOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panelOpen])

  const decide = useCallback((analytics: boolean) => {
    // `writeConsent` émet l'événement auquel `useSyncExternalStore` est abonné :
    // pas de setState ici, l'état vient du cookie.
    writeConsent(analytics)
    setPanelOpen(false)
  }, [])

  // Sans identifiant de mesure, il n'y a rien à consentir : le site ne dépose
  // que le cookie de session de l'espace bénévoles, exempté.
  if (!GA_MEASUREMENT_ID) return null

  const showBanner = hydrated && choice === null && !panelOpen

  return (
    <>
      <Analytics enabled={hydrated && choice?.analytics === true} />

      {showBanner && (
        <section
          aria-label="Gestion des cookies"
          className="fixed bottom-4 left-4 right-4 z-[90] md:right-auto md:bottom-6 md:left-6 md:max-w-lg animate-modal-in"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900">
              Ce site utilise des cookies
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              Nous aimerions mesurer l&apos;audience du site (pages consultées, provenance
              des visites) avec Google Analytics, afin de mieux faire connaître
              l&apos;association. Ces cookies ne sont déposés qu&apos;avec votre accord et
              vous pouvez changer d&apos;avis à tout moment.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button size="sm" shape="rounded" fullWidth onClick={() => decide(true)}>
                Tout accepter
              </Button>
              <Button
                size="sm"
                shape="rounded"
                variant="secondary"
                fullWidth
                onClick={() => decide(false)}
              >
                Tout refuser
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
              <button
                type="button"
                onClick={openPanel}
                className="font-semibold text-blue-900 underline underline-offset-2 hover:text-blue-700"
              >
                Personnaliser
              </button>
              <Link
                href="/mentions-legales#cookies"
                className="text-gray-500 underline underline-offset-2 hover:text-gray-700"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </section>
      )}

      {panelOpen && (
        <div
          className="animate-overlay-in fixed inset-0 z-[95] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-panel-title"
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            className="animate-modal-in max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl outline-none sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-6">
              <div>
                <h2 id="cookie-panel-title" className="mb-1 text-xl font-bold text-gray-900">
                  Préférences cookies
                </h2>
                <p className="text-sm text-gray-600">
                  Choisissez ce que vous acceptez. Votre décision est conservée 6 mois.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Fermer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-1 flex items-center justify-between gap-4">
                  <h3 className="mb-0 text-base font-semibold text-gray-900">
                    Cookies strictement nécessaires
                  </h3>
                  <span className="shrink-0 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                    Toujours actifs
                  </span>
                </div>
                <p className="mb-0 text-sm leading-relaxed text-gray-600">
                  Mémorisation de votre choix de cookies et session de connexion de
                  l&apos;espace bénévoles. Exemptés de consentement, ils ne servent à
                  aucun suivi.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-1 flex items-center justify-between gap-4">
                  <h3 className="mb-0 text-base font-semibold text-gray-900">
                    Mesure d&apos;audience
                  </h3>
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-2">
                    <span className="sr-only">Activer la mesure d&apos;audience</span>
                    <input
                      type="checkbox"
                      role="switch"
                      checked={analyticsDraft}
                      onChange={(e) => setAnalyticsDraft(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-brand after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
                    />
                  </label>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  Google Analytics 4, pour compter les visites et savoir quelles pages
                  sont utiles. Les données sont traitées par Google LLC.
                </p>
                <ul className="mb-0 space-y-1 text-xs text-gray-500">
                  <li>
                    <code className="rounded bg-gray-100 px-1 py-0.5">_ga</code> — distingue
                    les visiteurs · 13 mois
                  </li>
                  <li>
                    <code className="rounded bg-gray-100 px-1 py-0.5">_ga_*</code> — maintient
                    l&apos;état de la session · 13 mois
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 p-6 sm:flex-row-reverse">
              <Button
                size="sm"
                shape="rounded"
                fullWidth
                onClick={() => decide(analyticsDraft)}
              >
                Enregistrer mes choix
              </Button>
              <Button
                size="sm"
                shape="rounded"
                variant="secondary"
                fullWidth
                onClick={() => decide(true)}
              >
                Tout accepter
              </Button>
              <Button
                size="sm"
                shape="rounded"
                variant="secondary"
                fullWidth
                onClick={() => decide(false)}
              >
                Tout refuser
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CookieConsent
