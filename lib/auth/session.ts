import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export const COOKIE_NAME = 'admin_session';

const REMEMBER_DURATION_SECONDS = 90 * 24 * 60 * 60;

const SHORT_DURATION_SECONDS = 12 * 60 * 60;

const RENEW_RATIO = 0.5;

export type SessionPayload = JWTPayload & {
  role: 'admin';
  dur?: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET est absent ou trop court (32 caractères minimum). ' +
        'Générez-le avec : openssl rand -base64 32',
    );
  }
  return new TextEncoder().encode(secret);
}

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

function durationOf(payload: SessionPayload): number {
  const dur = payload.dur;
  if (typeof dur !== 'number' || dur <= 0) return REMEMBER_DURATION_SECONDS;
  return Math.min(dur, REMEMBER_DURATION_SECONDS);
}

export function shouldRenew(payload: SessionPayload): boolean {
  const remaining = (payload.exp ?? 0) - Math.floor(Date.now() / 1000);
  return remaining < durationOf(payload) * RENEW_RATIO;
}

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
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  };
}
