'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@crm-saas/types';

import { currentSessionQueryKey } from '@/features/auth/hooks/use-auth';

import { leadOwnersApi, mapLeadOwnerOptions } from '../api/lead-owners-api';
import { leadsApi } from '../api/leads-api';
import type { LeadFilters } from '../types/leads';

export const leadsQueryKey = ['leads'] as const;
export const leadOwnersQueryKey = ['leads', 'owners'] as const;

function getLeadListQueryKey(filters: LeadFilters) {
  return [
    ...leadsQueryKey,
    'list',
    filters.search ?? '',
    filters.status ?? '',
    filters.ownerUserId ?? '',
  ] as const;
}

function getLeadDetailsQueryKey(leadId: string) {
  return [...leadsQueryKey, 'details', leadId] as const;
}

export function useLeadOwnersQuery() {
  const queryClient = useQueryClient();
  const currentSession = queryClient.getQueryData<{ user: { role: UserRole } }>(currentSessionQueryKey);
  const canListOwners = currentSession?.user.role !== UserRole.SALES_REP;

  return useQuery({
    enabled: canListOwners,
    queryFn: async () => mapLeadOwnerOptions(await leadOwnersApi.listOwners()),
    queryKey: leadOwnersQueryKey,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLeadsQuery(filters: LeadFilters) {
  return useQuery({
    queryFn: () => leadsApi.listLeads(filters),
    queryKey: getLeadListQueryKey(filters),
  });
}

export function useLeadQuery(leadId: string) {
  return useQuery({
    enabled: Boolean(leadId),
    queryFn: () => leadsApi.getLead(leadId),
    queryKey: getLeadDetailsQueryKey(leadId),
  });
}

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => leadsApi.createLead(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getLeadDetailsQueryKey(response.lead.id), response);
      await queryClient.invalidateQueries({ queryKey: leadsQueryKey });
    },
  });
}

export function useUpdateLeadMutation(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => leadsApi.updateLead(leadId, values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getLeadDetailsQueryKey(leadId), response);
      await queryClient.invalidateQueries({ queryKey: leadsQueryKey });
    },
  });
}

export function useDeleteLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => leadsApi.deleteLead(leadId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: leadsQueryKey });
    },
  });
}

export function useConvertLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => leadsApi.convertLead(leadId),
    onSuccess: async (response) => {
      queryClient.setQueryData(getLeadDetailsQueryKey(response.lead.id), { lead: response.lead });
      await queryClient.invalidateQueries({ queryKey: leadsQueryKey });
    },
  });
}
