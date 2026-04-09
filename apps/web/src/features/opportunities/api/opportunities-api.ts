import { apiClient } from '@/services/api/api-client';

import type {
  OpportunityFilters,
  OpportunityResponse,
  OpportunitiesGroupedResponse,
  OpportunitiesListResponse,
} from '../types/opportunities';

function buildOpportunityQuery(
  filters: OpportunityFilters,
  options?: { groupBy?: 'stage' },
) {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set('search', filters.search);
  }

  if (filters.stage) {
    searchParams.set('stage', filters.stage);
  }

  if (filters.status) {
    searchParams.set('status', filters.status);
  }

  if (filters.ownerUserId) {
    searchParams.set('ownerUserId', filters.ownerUserId);
  }

  if (filters.sortBy) {
    searchParams.set('sortBy', filters.sortBy);
  }

  if (filters.order) {
    searchParams.set('order', filters.order);
  }

  if (options?.groupBy) {
    searchParams.set('groupBy', options.groupBy);
  }

  const queryString = searchParams.toString();

  return queryString ? `/opportunities?${queryString}` : '/opportunities';
}

export const opportunitiesApi = {
  createOpportunity(values: Record<string, unknown>) {
    return apiClient.post<OpportunityResponse>('/opportunities', {
      auth: true,
      body: values,
    });
  },
  getOpportunity(opportunityId: string) {
    return apiClient.get<OpportunityResponse>(`/opportunities/${opportunityId}`, { auth: true });
  },
  listOpportunities(filters: OpportunityFilters) {
    return apiClient.get<OpportunitiesListResponse>(buildOpportunityQuery(filters), {
      auth: true,
    });
  },
  listPipeline(filters: OpportunityFilters) {
    return apiClient.get<OpportunitiesGroupedResponse>(
      buildOpportunityQuery(filters, { groupBy: 'stage' }),
      { auth: true },
    );
  },
  updateOpportunity(opportunityId: string, values: Record<string, unknown>) {
    return apiClient.patch<OpportunityResponse>(`/opportunities/${opportunityId}`, {
      auth: true,
      body: values,
    });
  },
  updateOpportunityStage(opportunityId: string, stage: string) {
    return apiClient.patch<OpportunityResponse>(`/opportunities/${opportunityId}/stage`, {
      auth: true,
      body: { stage },
    });
  },
};
