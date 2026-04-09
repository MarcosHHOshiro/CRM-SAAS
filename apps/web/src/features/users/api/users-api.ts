import { apiClient } from '@/services/api/api-client';

import type { UserResponse, UsersResponse } from '../types/users';

export const usersApi = {
  createUser(values: Record<string, unknown>) {
    return apiClient.post<UserResponse>('/users', {
      auth: true,
      body: values,
    });
  },
  listUsers() {
    return apiClient.get<UsersResponse>('/users', { auth: true });
  },
  updateUser(userId: string, values: Record<string, unknown>) {
    return apiClient.patch<UserResponse>(`/users/${userId}`, {
      auth: true,
      body: values,
    });
  },
  updateUserStatus(userId: string, isActive: boolean) {
    return apiClient.patch<UserResponse>(`/users/${userId}/status`, {
      auth: true,
      body: { isActive },
    });
  },
};
