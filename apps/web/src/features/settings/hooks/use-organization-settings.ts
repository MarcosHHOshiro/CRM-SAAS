'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { currentSessionQueryKey } from '@/features/auth/hooks/use-auth';

import { organizationSettingsApi } from '../api/organization-settings-api';

export const organizationSettingsQueryKey = ['organization-settings', 'current'] as const;

export function useOrganizationSettingsQuery() {
  return useQuery({
    queryFn: () => organizationSettingsApi.getCurrentOrganization(),
    queryKey: organizationSettingsQueryKey,
  });
}

export function useUpdateOrganizationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      organizationSettingsApi.updateCurrentOrganization(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(organizationSettingsQueryKey, response);
      queryClient.setQueryData(currentSessionQueryKey, (currentSession: unknown) => {
        if (
          typeof currentSession !== 'object' ||
          currentSession === null ||
          !('organization' in currentSession)
        ) {
          return currentSession;
        }

        return {
          ...currentSession,
          organization: response.organization,
        };
      });
      await queryClient.invalidateQueries({ queryKey: organizationSettingsQueryKey });
    },
  });
}
