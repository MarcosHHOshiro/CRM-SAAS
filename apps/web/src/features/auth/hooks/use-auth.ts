'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from '../api/auth-api';
import type { LoginValues, RegisterValues } from '../types/auth';

export const currentSessionQueryKey = ['auth', 'current-session'] as const;

export function useCurrentSessionQuery() {
  return useQuery({
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
      queryClient.setQueryData(currentSessionQueryKey, session);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegisterValues) => authApi.register(values),
    onSuccess: (session) => {
      queryClient.setQueryData(currentSessionQueryKey, session);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      queryClient.removeQueries({ queryKey: currentSessionQueryKey });
      await queryClient.cancelQueries();
    },
  });
}
