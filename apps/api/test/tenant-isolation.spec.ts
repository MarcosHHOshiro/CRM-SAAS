import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createTestApp } from './helpers/test-app';
import { createLead, registerAndAuthenticate } from './helpers/factories';
import { prisma, resetDatabase } from './helpers/test-database';

describe('tenant isolation', () => {
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

  it('does not allow one tenant to read another tenant lead', async () => {
    const tenantA = await registerAndAuthenticate(app, 'tenant-a');
    const tenantB = await registerAndAuthenticate(app, 'tenant-b');
    const lead = await createLead(tenantA.agent, {
      company: 'Tenant A Inc',
      name: 'Tenant A Lead',
    });

    await tenantB.agent
      .get(`/api/leads/${lead.id}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe('Lead not found.');
      });
  });
});
