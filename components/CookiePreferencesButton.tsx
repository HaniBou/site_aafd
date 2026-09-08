'use client'

import { OPEN_PREFERENCES_EVENT } from '@/lib/consent'

/**
 * Rouvre le panneau de préférences cookies depuis le pied de page. Le RGPD
 * impose que le consentement soit retirable aussi simplement qu'il a été donné :
 * ce lien doit rester accessible depuis toutes les pages.
 */
export function CookiePreferencesButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
      className={className}
    >
      Gérer mes cookies
    </button>
  )
}

export default CookiePreferencesButton
