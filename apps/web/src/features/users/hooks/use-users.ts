'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersApi } from '../api/users-api';

export const usersQueryKey = ['users'] as const;

function getUserDetailsQueryKey(userId: string) {
  return [...usersQueryKey, 'details', userId] as const;
}

export function useUsersQuery() {
  return useQuery({
    queryFn: () => usersApi.listUsers(),
    queryKey: usersQueryKey,
    retry: false,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => usersApi.createUser(values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getUserDetailsQueryKey(response.user.id), response);
      await queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => usersApi.updateUser(userId, values),
    onSuccess: async (response) => {
      queryClient.setQueryData(getUserDetailsQueryKey(userId), response);
      await queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      isActive,
      userId,
    }: {
      isActive: boolean;
      userId: string;
    }) => usersApi.updateUserStatus(userId, isActive),
    onSuccess: async (response) => {
      queryClient.setQueryData(getUserDetailsQueryKey(response.user.id), response);
      await queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}
