import { apiClient } from '@/services/api/api-client';

import type { DashboardSummary } from '../types/dashboard';

export const dashboardApi = {
  getSummary() {
    return apiClient.get<DashboardSummary>('/dashboard/summary', { auth: true });
  },
};
