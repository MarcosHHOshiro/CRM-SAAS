import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createTestApp } from './helpers/test-app';
import {
  createClient,
  createOpportunity,
  registerAndAuthenticate,
} from './helpers/factories';
import { prisma, resetDatabase } from './helpers/test-database';

describe('opportunity stage updates', () => {
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

  it('changes an open opportunity stage without closing it', async () => {
    const { agent } = await registerAndAuthenticate(app, 'opportunity-stage');
    const client = await createClient(agent, {
      company: 'Stage Corp',
      name: 'Stage Client',
    });
    const opportunity = await createOpportunity(agent, client.id);

    const response = await agent
      .patch(`/api/opportunities/${opportunity.id}/stage`)
      .send({
        stage: 'NEGOTIATION',
      })
      .expect(200);

    expect(response.body.opportunity.stage).toBe('NEGOTIATION');
    expect(response.body.opportunity.status).toBe('OPEN');
  });

  it('marks an opportunity as won when moved to the WON stage', async () => {
    const { agent } = await registerAndAuthenticate(app, 'opportunity-won');
    const client = await createClient(agent, {
      company: 'Won Corp',
      name: 'Won Client',
    });
    const opportunity = await createOpportunity(agent, client.id);

    const response = await agent
      .patch(`/api/opportunities/${opportunity.id}/stage`)
      .send({
        stage: 'WON',
      })
      .expect(200);

    expect(response.body.opportunity.stage).toBe('WON');
    expect(response.body.opportunity.status).toBe('WON');
  });

  it('marks an opportunity as lost when moved to the LOST stage', async () => {
    const { agent } = await registerAndAuthenticate(app, 'opportunity-lost');
    const client = await createClient(agent, {
      company: 'Lost Corp',
      name: 'Lost Client',
    });
    const opportunity = await createOpportunity(agent, client.id);

    const response = await agent
      .patch(`/api/opportunities/${opportunity.id}/stage`)
      .send({
        stage: 'LOST',
      })
      .expect(200);

    expect(response.body.opportunity.stage).toBe('LOST');
    expect(response.body.opportunity.status).toBe('LOST');
  });
});
