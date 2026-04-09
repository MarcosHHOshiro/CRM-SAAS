import { apiClient } from '@/services/api/api-client';

import type { OrganizationResponse } from '../types/organization-settings';

export const organizationSettingsApi = {
  getCurrentOrganization() {
    return apiClient.get<OrganizationResponse>('/organizations/me', { auth: true });
  },
  updateCurrentOrganization(values: Record<string, unknown>) {
    return apiClient.patch<OrganizationResponse>('/organizations/me', {
      auth: true,
      body: values,
    });
  },
};
