'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from '../api/auth-api';
import { clearAuthSession, getRefreshToken, hasStoredSession, persistAuthSession } from '../lib/auth-storage';
import type { AuthSession, CurrentSession, LoginValues, RegisterValues } from '../types/auth';

export const currentSessionQueryKey = ['auth', 'current-session'] as const;

function toCurrentSession(session: AuthSession): CurrentSession {
  return {
    organization: session.organization,
    user: session.user,
  };
}

export function useCurrentSessionQuery() {
  return useQuery({
    enabled: hasStoredSession(),
    queryFn: () => authApi.getCurrentUser(),
    queryKey: currentSessionQueryKey,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginValues) => authApi.login(values),
    onSuccess: (session) => {
      persistAuthSession(session);
      queryClient.setQueryData(currentSessionQueryKey, toCurrentSession(session));
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegisterValues) => authApi.register(values),
    onSuccess: (session) => {
      persistAuthSession(session);
      queryClient.setQueryData(currentSessionQueryKey, toCurrentSession(session));
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return;
      }

      await authApi.logout(refreshToken);
    },
    onSettled: async () => {
      clearAuthSession();
      queryClient.removeQueries({ queryKey: currentSessionQueryKey });
      await queryClient.cancelQueries();
    },
  });
}
