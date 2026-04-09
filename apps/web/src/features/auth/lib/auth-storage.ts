import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants/auth-cookies';
import type { AuthSession } from '../types/auth';

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeCookieValue(cookie.slice(name.length + 1));
}

function getJwtExpirationTimestamp(token: string) {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = typeof atob === 'function' ? atob(normalized) : null;

    if (!decoded) {
      return null;
    }

    const parsed = JSON.parse(decoded) as { exp?: number };

    return typeof parsed.exp === 'number' ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const expiresAt = getJwtExpirationTimestamp(value);
  const maxAge =
    typeof expiresAt === 'number'
      ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      : undefined;

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'path=/',
    'samesite=lax',
  ];

  if (typeof maxAge === 'number') {
    parts.push(`max-age=${maxAge}`);
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    parts.push('secure');
  }

  document.cookie = parts.join('; ');
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const parts = [`${name}=`, 'path=/', 'max-age=0', 'samesite=lax'];

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    parts.push('secure');
  }

  document.cookie = parts.join('; ');
}

export function getAccessToken() {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken() {
  return readCookie(REFRESH_TOKEN_COOKIE);
}

export function hasStoredSession() {
  return Boolean(getAccessToken() || getRefreshToken());
}

export function persistAuthSession(session: Pick<AuthSession, 'accessToken' | 'refreshToken'>) {
  setCookie(ACCESS_TOKEN_COOKIE, session.accessToken);
  setCookie(REFRESH_TOKEN_COOKIE, session.refreshToken);
}

export function clearAuthSession() {
  clearCookie(ACCESS_TOKEN_COOKIE);
  clearCookie(REFRESH_TOKEN_COOKIE);
}
