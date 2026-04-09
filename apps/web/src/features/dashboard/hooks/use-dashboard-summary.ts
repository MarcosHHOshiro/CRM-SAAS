'use client';

import { useQuery } from '@tanstack/react-query';

import { dashboardApi } from '../api/dashboard-api';

export const dashboardSummaryQueryKey = ['dashboard', 'summary'] as const;

export function useDashboardSummaryQuery() {
  return useQuery({
    queryFn: () => dashboardApi.getSummary(),
    queryKey: dashboardSummaryQueryKey,
    staleTime: 60_000,
  });
}
