import type { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';

export const ACCESS_TOKEN_COOKIE = 'crm_access_token';
export const REFRESH_TOKEN_COOKIE = 'crm_refresh_token';

function isProduction(configService: ConfigService) {
  return configService.get<string>('NODE_ENV') === 'production';
}

function buildBaseCookieOptions(configService: ConfigService): CookieOptions {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: isProduction(configService),
  };
}

export function buildAccessTokenCookieOptions(
  configService: ConfigService,
  expiresAt: Date,
): CookieOptions {
  return {
    ...buildBaseCookieOptions(configService),
    expires: expiresAt,
  };
}

export function buildRefreshTokenCookieOptions(
  configService: ConfigService,
  expiresAt: Date,
): CookieOptions {
  return {
    ...buildBaseCookieOptions(configService),
    expires: expiresAt,
  };
}

export function clearAuthCookies(response: Response, configService: ConfigService) {
  const options = buildBaseCookieOptions(configService);

  response.clearCookie(ACCESS_TOKEN_COOKIE, options);
  response.clearCookie(REFRESH_TOKEN_COOKIE, options);
}

export function setAuthCookies(
  response: Response,
  configService: ConfigService,
  tokens: {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
  },
) {
  response.cookie(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    buildAccessTokenCookieOptions(configService, tokens.accessTokenExpiresAt),
  );
  response.cookie(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    buildRefreshTokenCookieOptions(configService, tokens.refreshTokenExpiresAt),
  );
}

export function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const [rawName, ...rawValueParts] = cookie.trim().split('=');

    if (rawName === name) {
      const rawValue = rawValueParts.join('=');

      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }

  return null;
}
