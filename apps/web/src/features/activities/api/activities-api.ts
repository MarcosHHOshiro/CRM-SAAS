import { apiClient } from '@/services/api/api-client';

import type { ActivitiesResponse, ActivityFilters, ActivityResponse } from '../types/activities';

function buildActivitiesQuery(filters: ActivityFilters) {
  const searchParams = new URLSearchParams();

  if (filters.type) {
    searchParams.set('type', filters.type);
  }

  if (filters.authorUserId) {
    searchParams.set('authorUserId', filters.authorUserId);
  }

  if (filters.leadId) {
    searchParams.set('leadId', filters.leadId);
  }

  if (filters.clientId) {
    searchParams.set('clientId', filters.clientId);
  }

  if (filters.opportunityId) {
    searchParams.set('opportunityId', filters.opportunityId);
  }

  const queryString = searchParams.toString();

  return queryString ? `/activities?${queryString}` : '/activities';
}

export const activitiesApi = {
  createActivity(values: Record<string, unknown>) {
    return apiClient.post<ActivityResponse>('/activities', {
      auth: true,
      body: values,
    });
  },
  listActivities(filters: ActivityFilters) {
    return apiClient.get<ActivitiesResponse>(buildActivitiesQuery(filters), { auth: true });
  },
};
