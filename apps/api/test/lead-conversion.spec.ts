import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createTestApp } from './helpers/test-app';
import { createLead, registerAndAuthenticate } from './helpers/factories';
import { prisma, resetDatabase } from './helpers/test-database';

describe('lead conversion', () => {
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

  it('converts a lead into a client and marks the lead as converted', async () => {
    const { agent } = await registerAndAuthenticate(app, 'convert-lead');
    const lead = await createLead(agent, {
      company: 'Conversion Co',
      email: 'lead@conversion.test',
      name: 'Lead To Convert',
    });

    const response = await agent.post(`/api/leads/${lead.id}/convert`).expect(201);

    expect(response.body.lead.status).toBe('CONVERTED');
    expect(response.body.client.sourceLeadId).toBe(lead.id);
    expect(response.body.client.email).toBe('lead@conversion.test');

    const storedClient = await prisma.client.findUnique({
      where: {
        id: response.body.client.id,
      },
    });
    const storedLead = await prisma.lead.findUnique({
      where: {
        id: lead.id,
      },
    });

    expect(storedClient?.sourceLeadId).toBe(lead.id);
    expect(storedLead?.status).toBe('CONVERTED');
  });
});
