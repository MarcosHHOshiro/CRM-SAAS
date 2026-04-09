export const DEFAULT_PRIVATE_ROUTE = '/dashboard';

export const AUTH_ROUTES = ['/login', '/register'] as const;

export const PRIVATE_ROUTE_PREFIXES = [
  '/dashboard',
  '/leads',
  '/clients',
  '/opportunities',
  '/activities',
  '/users',
  '/settings',
] as const;

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTE_PREFIXES.some(
    (routePrefix) => pathname === routePrefix || pathname.startsWith(`${routePrefix}/`),
  );
}

export function buildLoginHref(nextPath?: string) {
  if (!nextPath || nextPath === DEFAULT_PRIVATE_ROUTE) {
    return '/login';
  }

  return `/login?next=${encodeURIComponent(nextPath)}`;
}
