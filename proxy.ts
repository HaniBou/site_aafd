import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_session';

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // Sans ce contrôle, la clé HMAC vaudrait la chaîne "undefined"
  // et n'importe qui pourrait forger un cookie admin valide.
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET est absent ou trop court (32 caractères minimum).',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifié avant toute chose : une configuration incomplète doit échouer
  // bruyamment, jamais laisser passer.
  const secret = getSecret();

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
