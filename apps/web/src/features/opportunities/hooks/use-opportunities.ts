'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@crm-saas/types';

import { currentSessionQueryKey } from '@/features/auth/hooks/use-auth';

import { opportunityClientsApi, mapOpportunityClientOptions } from '../api/opportunity-clients-api';
import { opportunityOwnersApi, mapOpportunityOwnerOptions } from '../api/opportunity-owners-api';
import { opportunitiesApi } from '../api/opportunities-api';
import type { OpportunityFilters } from '../types/opportunities';

export const opportunitiesQueryKey = ['opportunities'] as const;
export const opportunityOwnersQueryKey = ['opportunities', 'owners'] as const;
export const opportunityClientsQueryKey = ['opportunities', 'clients'] as const;

function getOpportunityListQueryKey(filters: OpportunityFilters) {
  return [
    ...opportunitiesQueryKey,
    'list',
    filters.search ?? '',
    filters.stage ?? '',
    filters.status ?? '',
    filters.ownerUserId ?? '',
    filters.sortBy ?? '',
    filters.order ?? '',
  ] as const;
}

function getOpportunityPipelineQueryKey(filters: OpportunityFilters) {
  return [
    ...opportunitiesQueryKey,
    'pipeline',
    filters.search ?? '',
    filters.stage ?? '',
    filters.status ?? '',
    filters.ownerUserId ?? '',
    filters.sortBy ?? '',
    filters.order ?? '',
  ] as const;
}

function getOpportunityDetailsQueryKey(opportunityId: string) {
  return [...opportunitiesQueryKey, 'details', opportunityId] as const;
}

export function useOpportunityOwnersQuery() {
  const queryClient = useQueryClient();
  const currentSession = queryClient.getQueryData<{ user: { role: UserRole } }>(
    currentSessionQueryKey,
  );
  const canListOwners = currentSession?.user.role !== UserRole.SALES_REP;

  return useQuery({
    enabled: canListOwners,
    queryFn: async () => mapOpportunityOwnerOptions(await opportunityOwnersApi.listOwners()),
    queryKey: opportunityOwnersQueryKey,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useOpportunityClientsQuery() {
  return useQuery({
    queryFn: async () => mapOpportunityClientOptions(await opportunityClientsApi.listClients()),
    queryKey: opportunityClientsQueryKey,
    staleTime: 5 * 60_000,
  });
}

export function useOpportunitiesQuery(filters: OpportunityFilters) {
  return useQuery({
    queryFn: () => opportunitiesApi.listOpportunities(filters),
    queryKey: getOpportunityListQueryKey(filters),
  });
}

export function useOpportunityPipelineQuery(filters: OpportunityFilters) {
  return useQuery({
    queryFn: () => opportunitiesApi.listPipeline(filters),
    queryKey: getOpportunityPipelineQueryKey(filters),
  });
}

export function useOpportunityQuery(opportunityId: string) {
  return useQuery({
    enabled: Boolean(opportunityId),
    queryFn: () => opportunitiesApi.getOpportunity(opportunityId),
    queryKey: getOpportunityDetailsQueryKey(opportunityId),
  });
}

export function useCreateOpportunityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => opportunitiesApi.createOpportunity(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getOpportunityDetailsQueryKey(response.opportunity.id), response);
      await queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey });
    },
  });
}

export function useUpdateOpportunityMutation(opportunityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      opportunitiesApi.updateOpportunity(opportunityId, values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getOpportunityDetailsQueryKey(opportunityId), response);
      await queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey });
    },
  });
}

export function useUpdateOpportunityStageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ opportunityId, stage }: { opportunityId: string; stage: string }) =>
      opportunitiesApi.updateOpportunityStage(opportunityId, stage),
    onSuccess: async (response) => {
      queryClient.setQueryData(getOpportunityDetailsQueryKey(response.opportunity.id), {
        opportunity: response.opportunity,
      });
      await queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey });
    },
  });
}
