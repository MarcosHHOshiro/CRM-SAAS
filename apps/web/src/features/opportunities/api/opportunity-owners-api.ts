import { apiClient } from '@/services/api/api-client';

import type { OpportunityOwnerOption } from '../types/opportunities';

type ListUsersResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  }>;
};

export const opportunityOwnersApi = {
  listOwners() {
    return apiClient.get<ListUsersResponse>('/users', { auth: true });
  },
};

export function mapOpportunityOwnerOptions(
  response: ListUsersResponse,
): OpportunityOwnerOption[] {
  return response.users.map((user) => ({
    email: user.email,
    id: user.id,
    isActive: user.isActive,
    name: user.name,
  }));
}
