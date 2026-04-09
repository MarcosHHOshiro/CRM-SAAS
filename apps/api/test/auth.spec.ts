import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../src/modules/auth/auth-cookie';
import { createTestApp } from './helpers/test-app';
import { prisma, resetDatabase } from './helpers/test-database';

function findCookie(setCookieHeaders: string[], cookieName: string) {
  return setCookieHeaders.find((cookie) => cookie.startsWith(`${cookieName}=`));
}

function getCookieValue(setCookieHeaders: string[], cookieName: string) {
  const cookie = findCookie(setCookieHeaders, cookieName);

  return cookie?.split(';')[0]?.split('=')[1] ?? null;
}

describe('auth critical flows', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await prisma.$connect();
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('registers a workspace and sets HttpOnly auth cookies', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        organizationName: 'Acme CRM',
        organizationSlug: 'acme-crm',
        name: 'Alice Owner',
        email: 'alice@acme.test',
        password: 'password123',
      })
      .expect(201);

    const setCookieHeaders = response.headers['set-cookie'] ?? [];
    const accessCookie = findCookie(setCookieHeaders, ACCESS_TOKEN_COOKIE);
    const refreshCookie = findCookie(setCookieHeaders, REFRESH_TOKEN_COOKIE);

    expect(accessCookie).toContain('HttpOnly');
    expect(accessCookie).toContain('SameSite=Lax');
    expect(refreshCookie).toContain('HttpOnly');
    expect(refreshCookie).toContain('SameSite=Lax');
    expect(response.body).toMatchObject({
      user: {
        email: 'alice@acme.test',
        role: 'OWNER',
      },
      organization: {
        slug: 'acme-crm',
      },
    });
    expect(response.body).not.toHaveProperty('accessToken');
    expect(response.body).not.toHaveProperty('refreshToken');
  });

  it('logs in an existing user and authenticates /auth/me with the issued cookie', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        organizationName: 'Northwind',
        organizationSlug: 'northwind',
        name: 'Nina Owner',
        email: 'nina@northwind.test',
        password: 'password123',
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'nina@northwind.test',
        password: 'password123',
      })
      .expect(200);

    const setCookieHeaders = loginResponse.headers['set-cookie'] ?? [];
    const accessCookie = findCookie(setCookieHeaders, ACCESS_TOKEN_COOKIE);

    expect(accessCookie).toBeTruthy();

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', [accessCookie as string])
      .expect(200)
      .expect(({ body }) => {
        expect(body.user.email).toBe('nina@northwind.test');
        expect(body.organization.slug).toBe('northwind');
      });
  });

  it('refreshes the session and rotates the refresh token cookie', async () => {
    const agent = request.agent(app.getHttpServer());

    const registerResponse = await agent
      .post('/api/auth/register')
      .send({
        organizationName: 'Refresh Org',
        organizationSlug: 'refresh-org',
        name: 'Riley Owner',
        email: 'riley@refresh.test',
        password: 'password123',
      })
      .expect(201);

    const initialRefreshToken = getCookieValue(
      registerResponse.headers['set-cookie'] ?? [],
      REFRESH_TOKEN_COOKIE,
    );

    const refreshResponse = await agent.post('/api/auth/refresh').send({}).expect(200);
    const rotatedRefreshToken = getCookieValue(
      refreshResponse.headers['set-cookie'] ?? [],
      REFRESH_TOKEN_COOKIE,
    );

    expect(initialRefreshToken).toBeTruthy();
    expect(rotatedRefreshToken).toBeTruthy();
    expect(rotatedRefreshToken).not.toBe(initialRefreshToken);
    expect(refreshResponse.body.user.email).toBe('riley@refresh.test');
  });
});
