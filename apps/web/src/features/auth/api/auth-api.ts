import { apiClient } from '@/services/api/api-client';

import type { CurrentSession, LoginValues, RegisterValues } from '../types/auth';

export const authApi = {
  getCurrentUser() {
    return apiClient.get<CurrentSession>('/auth/me', { auth: true });
  },
  login(values: LoginValues) {
    return apiClient.post<CurrentSession>('/auth/login', {
      auth: false,
      body: values,
    });
  },
  logout() {
    return apiClient.post<{ message: string }>('/auth/logout', {
      auth: false,
    });
  },
  register(values: RegisterValues) {
    return apiClient.post<CurrentSession>('/auth/register', {
      auth: false,
      body: values,
    });
  },
};
