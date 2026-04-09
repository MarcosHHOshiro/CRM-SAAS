import { apiClient } from '@/services/api/api-client';

import type { AuthSession, CurrentSession, LoginValues, RegisterValues } from '../types/auth';

export const authApi = {
  getCurrentUser() {
    return apiClient.get<CurrentSession>('/auth/me', { auth: true });
  },
  login(values: LoginValues) {
    return apiClient.post<AuthSession>('/auth/login', {
      auth: false,
      body: values,
    });
  },
  logout(refreshToken: string) {
    return apiClient.post<{ message: string }>('/auth/logout', {
      auth: false,
      body: { refreshToken },
    });
  },
  register(values: RegisterValues) {
    return apiClient.post<AuthSession>('/auth/register', {
      auth: false,
      body: values,
    });
  },
};
