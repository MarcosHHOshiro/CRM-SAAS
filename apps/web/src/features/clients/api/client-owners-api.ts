import { apiClient } from '@/services/api/api-client';

import type { ClientOwnerOption } from '../types/clients';

type ListUsersResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  }>;
};

export const clientOwnersApi = {
  listOwners() {
    return apiClient.get<ListUsersResponse>('/users', { auth: true });
  },
};

export function mapClientOwnerOptions(response: ListUsersResponse): ClientOwnerOption[] {
  return response.users.map((user) => ({
    email: user.email,
    id: user.id,
    isActive: user.isActive,
    name: user.name,
  }));
}
