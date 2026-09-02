import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export const COOKIE_NAME = 'admin_session';

/**
 * Session « Rester connecté » : 90 jours, renouvelés à chaque visite (voir proxy.ts).
 * Un bénévole qui passe au moins une fois par trimestre ne revoit jamais l'écran
 * de connexion.
 */
const REMEMBER_DURATION_SECONDS = 90 * 24 * 60 * 60;

/** Case décochée : ordinateur partagé ou emprunté, la session dure la demi-journée. */
const SHORT_DURATION_SECONDS = 12 * 60 * 60;

/**
 * Le cookie n'est réémis que lorsqu'il reste moins de la moitié de sa durée de vie :
 * resigner un JWT à chaque requête coûterait cher pour rien.
 */
const RENEW_RATIO = 0.5;

export type SessionPayload = JWTPayload & {
  role: 'admin';
  /** Durée de vie choisie à la connexion, rejouée à chaque renouvellement. */
  dur?: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // Sans ce contrôle, la clé HMAC vaudrait la chaîne "undefined"
  // et n'importe qui pourrait forger un cookie admin valide.
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET est absent ou trop court (32 caractères minimum). ' +
        'Générez-le avec : openssl rand -base64 32',
    );
  }
  return new TextEncoder().encode(secret);
}

/** À appeler en amont d'une vérification : une configuration incomplète doit
 *  échouer bruyamment, jamais laisser passer. */
export function assertSessionSecret(): void {
  getSecret();
}

export function sessionDuration(remember: boolean): number {
  return remember ? REMEMBER_DURATION_SECONDS : SHORT_DURATION_SECONDS;
}

export async function createSessionToken(
  uid: string,
  durationSeconds: number = REMEMBER_DURATION_SECONDS,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ role: 'admin', dur: durationSeconds })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(uid)
    .setIssuedAt(now)
    .setExpirationTime(now + durationSeconds)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as SessionPayload;
}

/**
 * Les cookies émis avant l'introduction de `dur` n'ont pas la revendication :
 * on les traite comme des sessions longues, ce qui les fait glisser vers 90 jours
 * au prochain passage au lieu d'expirer brutalement au bout de 7.
 */
function durationOf(payload: SessionPayload): number {
  const dur = payload.dur;
  if (typeof dur !== 'number' || dur <= 0) return REMEMBER_DURATION_SECONDS;
  return Math.min(dur, REMEMBER_DURATION_SECONDS);
}

/** Vrai quand il reste moins de la moitié de la durée de vie du cookie. */
export function shouldRenew(payload: SessionPayload): boolean {
  const remaining = (payload.exp ?? 0) - Math.floor(Date.now() / 1000);
  return remaining < durationOf(payload) * RENEW_RATIO;
}

/** Réémet un cookie neuf reparti pour la durée d'origine. */
export async function renewSessionToken(
  payload: SessionPayload,
): Promise<{ token: string; maxAge: number } | null> {
  if (!payload.sub) return null;
  const maxAge = durationOf(payload);
  return { token: await createSessionToken(payload.sub, maxAge), maxAge };
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // 'lax' plutôt que 'strict' : en 'strict', arriver sur /admin depuis un lien
    // externe (webmail, message, favori partagé) n'envoie pas le cookie et renvoie
    // vers la connexion alors que la session est valide. 'lax' ne transmet toujours
    // pas le cookie sur un POST cross-site, donc les écritures restent protégées.
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  };
}
