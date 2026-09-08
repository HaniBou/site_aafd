// Stockage du choix de l'internaute en matiere de cookies.
//
// Le cookie ecrit ici est lui-meme « strictement necessaire » au sens de la
// CNIL : il ne sert qu'a memoriser le consentement (ou le refus) pour ne pas
// redemander a chaque page. Il est donc pose sans consentement prealable, mais
// uniquement APRES que l'internaute a cliqué.
//
// Ce module est purement client : il touche `document.cookie`.

export const CONSENT_COOKIE_NAME = 'aafd_consent'

// A incrementer si les finalites changent (nouvel outil, nouvelle categorie) :
// un choix enregistre sous une version anterieure est ignore et la banniere
// reapparait, comme l'exige un recueil de consentement specifique.
export const CONSENT_VERSION = 1

// La CNIL recommande de conserver le choix 6 mois maximum, refus compris.
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182

// Evenement emis quand le choix change, pour que la page reagisse sans rechargement.
export const CONSENT_CHANGE_EVENT = 'aafd:consent-change'

// Evenement emis par le lien « Gerer mes cookies » du pied de page.
export const OPEN_PREFERENCES_EVENT = 'aafd:open-cookie-preferences'

export type ConsentChoice = {
  version: number
  /** Mesure d'audience Google Analytics. */
  analytics: boolean
  /** Date ISO du choix, utile pour prouver le recueil. */
  date: string
}

function isBrowser(): boolean {
  return typeof document !== 'undefined'
}

function rawConsentCookie(): string | null {
  if (!isBrowser()) return null
  return (
    document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`))
      ?.slice(CONSENT_COOKIE_NAME.length + 1) ?? null
  )
}

function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentChoice>
    if (parsed.version !== CONSENT_VERSION) return null
    if (typeof parsed.analytics !== 'boolean') return null
    return {
      version: CONSENT_VERSION,
      analytics: parsed.analytics,
      date: typeof parsed.date === 'string' ? parsed.date : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

// `useSyncExternalStore` compare les instantanes par identite : sans ce cache,
// chaque lecture rendrait un nouvel objet et provoquerait une boucle de rendu.
let cachedRaw: string | null = null
let cachedChoice: ConsentChoice | null = null

/**
 * Retourne le choix enregistre, ou `null` si l'internaute n'a pas encore
 * repondu (ou si le choix date d'une version anterieure des finalites).
 */
export function readConsent(): ConsentChoice | null {
  const raw = rawConsentCookie()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedChoice = parseConsent(raw)
  }
  return cachedChoice
}

/** Instantane cote serveur : le cookie n'est pas lisible au rendu statique. */
export function readConsentOnServer(): null {
  return null
}

/** S'abonne aux changements de choix, pour `useSyncExternalStore`. */
export function subscribeToConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
}

/** Enregistre le choix et previent le reste de la page. */
export function writeConsent(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = {
    version: CONSENT_VERSION,
    analytics,
    date: new Date().toISOString(),
  }

  if (isBrowser()) {
    const value = encodeURIComponent(JSON.stringify(choice))
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie =
      `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}` +
      `; SameSite=Lax${secure}`

    window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGE_EVENT, { detail: choice }))
  }

  return choice
}

/**
 * Domaines sur lesquels un cookie a pu etre pose : Google Analytics ecrit sur
 * le domaine parent (`.exemple.fr`) alors que la suppression doit cibler
 * exactement le meme domaine que la creation.
 */
function domainVariants(): string[] {
  const parts = window.location.hostname.split('.')
  const variants = [''] // sans attribut Domain
  for (let i = 0; i < parts.length - 1; i++) {
    variants.push(`.${parts.slice(i).join('.')}`)
  }
  return variants
}

/**
 * Supprime les cookies deposes par Google Analytics. Appele quand l'internaute
 * retire son consentement : `consent update denied` empeche les nouveaux
 * depots mais ne nettoie pas les anciens.
 */
export function clearAnalyticsCookies(): void {
  if (!isBrowser()) return

  const names = document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((name) => name === '_gid' || name === '_gat' || name.startsWith('_ga'))

  for (const name of names) {
    for (const domain of domainVariants()) {
      document.cookie =
        `${name}=; Path=/; Max-Age=0` + (domain ? `; Domain=${domain}` : '')
    }
  }
}
