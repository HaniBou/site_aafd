import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'admin_session';
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

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

export async function createSessionToken(uid: string): Promise<string> {
  return new SignJWT({ sub: uid, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}
