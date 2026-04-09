import { apiClient } from '@/services/api/api-client';

import type { ConvertLeadResponse, LeadFilters, LeadResponse, LeadsListResponse } from '../types/leads';

function buildLeadsQuery(filters: LeadFilters) {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set('search', filters.search);
  }

  if (filters.status) {
    searchParams.set('status', filters.status);
  }

  if (filters.ownerUserId) {
    searchParams.set('ownerUserId', filters.ownerUserId);
  }

  const queryString = searchParams.toString();

  return queryString ? `/leads?${queryString}` : '/leads';
}

export const leadsApi = {
  convertLead(leadId: string) {
    return apiClient.post<ConvertLeadResponse>(`/leads/${leadId}/convert`, { auth: true });
  },
  createLead(values: Record<string, unknown>) {
    return apiClient.post<LeadResponse>('/leads', {
      auth: true,
      body: values,
    });
  },
  deleteLead(leadId: string) {
    return apiClient.delete<{ message: string }>(`/leads/${leadId}`, { auth: true });
  },
  getLead(leadId: string) {
    return apiClient.get<LeadResponse>(`/leads/${leadId}`, { auth: true });
  },
  listLeads(filters: LeadFilters) {
    return apiClient.get<LeadsListResponse>(buildLeadsQuery(filters), { auth: true });
  },
  updateLead(leadId: string, values: Record<string, unknown>) {
    return apiClient.patch<LeadResponse>(`/leads/${leadId}`, {
      auth: true,
      body: values,
    });
  },
};
