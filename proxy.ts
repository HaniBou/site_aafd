import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  assertSessionSecret,
  verifySessionToken,
  shouldRenew,
  renewSessionToken,
  sessionCookieOptions,
  COOKIE_NAME,
} from '@/lib/auth/session';

function redirectToLogin(request: NextRequest, clearCookie: boolean) {
  const url = new URL('/admin/login', request.url);
  const { pathname, search } = request.nextUrl;
  if (pathname !== '/admin') {
    url.searchParams.set('next', pathname + search);
  }
  const response = NextResponse.redirect(url);
  if (clearCookie) response.cookies.delete(COOKIE_NAME);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  assertSessionSecret();

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request, false);
  }

  try {
    const payload = await verifySessionToken(token);

    if (shouldRenew(payload)) {
      const renewed = await renewSessionToken(payload);
      if (renewed) {
        const response = NextResponse.next();
        response.cookies.set({
          name: COOKIE_NAME,
          value: renewed.token,
          ...sessionCookieOptions(renewed.maxAge),
        });
        return response;
      }
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(request, true);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
