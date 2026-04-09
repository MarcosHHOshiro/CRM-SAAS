import { apiClient } from '@/services/api/api-client';

import type { LeadOwnerOption } from '../types/leads';

type ListUsersResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  }>;
};

export const leadOwnersApi = {
  listOwners() {
    return apiClient.get<ListUsersResponse>('/users', { auth: true });
  },
};

export function mapLeadOwnerOptions(response: ListUsersResponse): LeadOwnerOption[] {
  return response.users.map((user) => ({
    email: user.email,
    id: user.id,
    isActive: user.isActive,
    name: user.name,
  }));
}
