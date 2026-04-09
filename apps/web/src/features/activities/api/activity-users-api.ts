import { apiClient } from '@/services/api/api-client';

import type { ActivityUserOption } from '../types/activities';

type ListUsersResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  }>;
};

export const activityUsersApi = {
  listUsers() {
    return apiClient.get<ListUsersResponse>('/users', { auth: true });
  },
};

export function mapActivityUserOptions(response: ListUsersResponse): ActivityUserOption[] {
  return response.users.map((user) => ({
    email: user.email,
    id: user.id,
    isActive: user.isActive,
    name: user.name,
  }));
}
