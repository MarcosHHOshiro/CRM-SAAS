import { apiClient } from '@/services/api/api-client';

import type { OpportunityClientOption } from '../types/opportunities';

type ListClientsResponse = {
  clients: Array<{
    id: string;
    name: string;
    company: string | null;
  }>;
};

export const opportunityClientsApi = {
  listClients() {
    return apiClient.get<ListClientsResponse>('/clients', { auth: true });
  },
};

export function mapOpportunityClientOptions(
  response: ListClientsResponse,
): OpportunityClientOption[] {
  return response.clients.map((client) => ({
    company: client.company,
    id: client.id,
    name: client.name,
  }));
}
