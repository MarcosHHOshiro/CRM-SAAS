'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@crm-saas/types';

import { currentSessionQueryKey } from '@/features/auth/hooks/use-auth';

import { activitiesApi } from '../api/activities-api';
import {
  activityRelationsApi,
  mapActivityClientOptions,
  mapActivityLeadOptions,
  mapActivityOpportunityOptions,
} from '../api/activity-relations-api';
import { activityUsersApi, mapActivityUserOptions } from '../api/activity-users-api';
import type { ActivityFilters } from '../types/activities';

export const activitiesQueryKey = ['activities'] as const;
export const activityUsersQueryKey = ['activities', 'users'] as const;
export const activityLeadsQueryKey = ['activities', 'leads'] as const;
export const activityClientsQueryKey = ['activities', 'clients'] as const;
export const activityOpportunitiesQueryKey = ['activities', 'opportunities'] as const;

function getActivityListQueryKey(filters: ActivityFilters) {
  return [
    ...activitiesQueryKey,
    'list',
    filters.type ?? '',
    filters.authorUserId ?? '',
    filters.leadId ?? '',
    filters.clientId ?? '',
    filters.opportunityId ?? '',
  ] as const;
}

export function useActivityUsersQuery() {
  const queryClient = useQueryClient();
  const currentSession = queryClient.getQueryData<{ user: { role: UserRole } }>(
    currentSessionQueryKey,
  );
  const canListUsers = currentSession?.user.role !== UserRole.SALES_REP;

  return useQuery({
    enabled: canListUsers,
    queryFn: async () => mapActivityUserOptions(await activityUsersApi.listUsers()),
    queryKey: activityUsersQueryKey,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useActivityLeadsQuery() {
  return useQuery({
    queryFn: async () => mapActivityLeadOptions(await activityRelationsApi.listLeads()),
    queryKey: activityLeadsQueryKey,
    staleTime: 5 * 60_000,
  });
}

export function useActivityClientsQuery() {
  return useQuery({
    queryFn: async () => mapActivityClientOptions(await activityRelationsApi.listClients()),
    queryKey: activityClientsQueryKey,
    staleTime: 5 * 60_000,
  });
}

export function useActivityOpportunitiesQuery() {
  return useQuery({
    queryFn: async () =>
      mapActivityOpportunityOptions(await activityRelationsApi.listOpportunities()),
    queryKey: activityOpportunitiesQueryKey,
    staleTime: 5 * 60_000,
  });
}

export function useActivitiesQuery(filters: ActivityFilters) {
  return useQuery({
    queryFn: () => activitiesApi.listActivities(filters),
    queryKey: getActivityListQueryKey(filters),
  });
}

export function useCreateActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => activitiesApi.createActivity(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: activitiesQueryKey });
    },
  });
}
