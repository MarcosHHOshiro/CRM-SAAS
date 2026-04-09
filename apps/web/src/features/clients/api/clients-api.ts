import { apiClient } from '@/services/api/api-client';

import type { ClientFilters, ClientResponse, ClientsListResponse } from '../types/clients';

function buildClientsQuery(filters: ClientFilters) {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set('search', filters.search);
  }

  const queryString = searchParams.toString();

  return queryString ? `/clients?${queryString}` : '/clients';
}

export const clientsApi = {
  createClient(values: Record<string, unknown>) {
    return apiClient.post<ClientResponse>('/clients', {
      auth: true,
      body: values,
    });
  },
  getClient(clientId: string) {
    return apiClient.get<ClientResponse>(`/clients/${clientId}`, { auth: true });
  },
  listClients(filters: ClientFilters) {
    return apiClient.get<ClientsListResponse>(buildClientsQuery(filters), { auth: true });
  },
  updateClient(clientId: string, values: Record<string, unknown>) {
    return apiClient.patch<ClientResponse>(`/clients/${clientId}`, {
      auth: true,
      body: values,
    });
  },
};
