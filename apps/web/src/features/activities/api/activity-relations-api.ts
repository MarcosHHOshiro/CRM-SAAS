import { apiClient } from '@/services/api/api-client';

import type {
  ActivityClientOption,
  ActivityLeadOption,
  ActivityOpportunityOption,
} from '../types/activities';

type LeadsResponse = {
  leads: Array<{
    id: string;
    name: string;
    status: string;
  }>;
};

type ClientsResponse = {
  clients: Array<{
    id: string;
    name: string;
    company: string | null;
  }>;
};

type OpportunitiesResponse = {
  opportunities: Array<{
    id: string;
    title: string;
    clientId: string;
    stage: string;
    status: string;
  }>;
};

export const activityRelationsApi = {
  listClients() {
    return apiClient.get<ClientsResponse>('/clients', { auth: true });
  },
  listLeads() {
    return apiClient.get<LeadsResponse>('/leads', { auth: true });
  },
  listOpportunities() {
    return apiClient.get<OpportunitiesResponse>('/opportunities', { auth: true });
  },
};

export function mapActivityLeadOptions(response: LeadsResponse): ActivityLeadOption[] {
  return response.leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    status: lead.status,
  }));
}

export function mapActivityClientOptions(response: ClientsResponse): ActivityClientOption[] {
  return response.clients.map((client) => ({
    company: client.company,
    id: client.id,
    name: client.name,
  }));
}

export function mapActivityOpportunityOptions(
  response: OpportunitiesResponse,
): ActivityOpportunityOption[] {
  return response.opportunities.map((opportunity) => ({
    clientId: opportunity.clientId,
    id: opportunity.id,
    stage: opportunity.stage,
    status: opportunity.status,
    title: opportunity.title,
  }));
}
