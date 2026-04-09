'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@crm-saas/types';

import { currentSessionQueryKey } from '@/features/auth/hooks/use-auth';

import { clientOwnersApi, mapClientOwnerOptions } from '../api/client-owners-api';
import { clientsApi } from '../api/clients-api';
import type { ClientFilters } from '../types/clients';

export const clientsQueryKey = ['clients'] as const;
export const clientOwnersQueryKey = ['clients', 'owners'] as const;

function getClientListQueryKey(filters: ClientFilters) {
  return [...clientsQueryKey, 'list', filters.search ?? ''] as const;
}

function getClientDetailsQueryKey(clientId: string) {
  return [...clientsQueryKey, 'details', clientId] as const;
}

export function useClientOwnersQuery() {
  const queryClient = useQueryClient();
  const currentSession = queryClient.getQueryData<{ user: { role: UserRole } }>(currentSessionQueryKey);
  const canListOwners = currentSession?.user.role !== UserRole.SALES_REP;

  return useQuery({
    enabled: canListOwners,
    queryFn: async () => mapClientOwnerOptions(await clientOwnersApi.listOwners()),
    queryKey: clientOwnersQueryKey,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useClientsQuery(filters: ClientFilters) {
  return useQuery({
    queryFn: () => clientsApi.listClients(filters),
    queryKey: getClientListQueryKey(filters),
  });
}

export function useClientQuery(clientId: string) {
  return useQuery({
    enabled: Boolean(clientId),
    queryFn: () => clientsApi.getClient(clientId),
    queryKey: getClientDetailsQueryKey(clientId),
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => clientsApi.createClient(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getClientDetailsQueryKey(response.client.id), response);
      await queryClient.invalidateQueries({ queryKey: clientsQueryKey });
    },
  });
}

export function useUpdateClientMutation(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => clientsApi.updateClient(clientId, values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getClientDetailsQueryKey(clientId), response);
      await queryClient.invalidateQueries({ queryKey: clientsQueryKey });
    },
  });
}
