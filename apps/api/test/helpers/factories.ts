import type { INestApplication } from '@nestjs/common';
import type { OpportunityStage } from '@prisma/client';
import request from 'supertest';

type HttpAgent = ReturnType<typeof request.agent>;

let sequence = 0;

function nextIdentifier(prefix: string) {
  sequence += 1;

  return `${prefix}-${Date.now()}-${sequence}`;
}

export function buildRegisterPayload(prefix: string) {
  const slug = nextIdentifier(prefix);

  return {
    organizationName: `${prefix} organization`,
    organizationSlug: slug,
    name: `${prefix} owner`,
    email: `${slug}@example.com`,
    password: 'password123',
  };
}

export async function registerAndAuthenticate(
  app: INestApplication,
  prefix: string,
) {
  const agent = request.agent(app.getHttpServer());
  const credentials = buildRegisterPayload(prefix);
  const response = await agent.post('/api/auth/register').send(credentials).expect(201);

  return {
    agent,
    credentials,
    response,
  };
}

export async function createLead(
  agent: HttpAgent,
  overrides: Partial<{
    company: string;
    email: string;
    name: string;
    notes: string;
    phone: string;
  }> = {},
) {
  const response = await agent
    .post('/api/leads')
    .send({
      name: `${nextIdentifier('lead')} name`,
      email: `${nextIdentifier('lead')}@example.com`,
      phone: '555-0101',
      company: 'Northwind',
      notes: 'Warm inbound lead',
      ...overrides,
    })
    .expect(201);

  return response.body.lead as {
    clientId: string | null;
    id: string;
    status: string;
  };
}

export async function createClient(
  agent: HttpAgent,
  overrides: Partial<{
    company: string;
    email: string;
    name: string;
    phone: string;
  }> = {},
) {
  const response = await agent
    .post('/api/clients')
    .send({
      name: `${nextIdentifier('client')} name`,
      email: `${nextIdentifier('client')}@example.com`,
      phone: '555-0202',
      company: 'Acme',
      ...overrides,
    })
    .expect(201);

  return response.body.client as {
    id: string;
  };
}

export async function createOpportunity(
  agent: HttpAgent,
  clientId: string,
  overrides: Partial<{
    estimatedValue: string;
    stage: OpportunityStage;
    title: string;
  }> = {},
) {
  const response = await agent
    .post('/api/opportunities')
    .send({
      title: `${nextIdentifier('opportunity')} title`,
      clientId,
      estimatedValue: '12000.00',
      ...overrides,
    })
    .expect(201);

  return response.body.opportunity as {
    id: string;
    stage: string;
    status: string;
  };
}
