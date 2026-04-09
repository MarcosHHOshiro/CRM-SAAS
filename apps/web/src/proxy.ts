import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/features/auth/constants/auth-cookies';
import { buildLoginHref, DEFAULT_PRIVATE_ROUTE, isAuthRoute, isPrivateRoute } from '@/lib/routes';

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const hasSession =
    request.cookies.has(ACCESS_TOKEN_COOKIE) || request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL(DEFAULT_PRIVATE_ROUTE, request.url));
  }

  if (isPrivateRoute(pathname) && !hasSession) {
    const nextPath = `${pathname}${nextUrl.search}`;

    return NextResponse.redirect(new URL(buildLoginHref(nextPath), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
