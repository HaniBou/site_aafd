import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'admin_session';
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

function getSecret() {
  return new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!);
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
