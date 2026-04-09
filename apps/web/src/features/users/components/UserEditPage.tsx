'use client';

import { UserRole } from '@crm-saas/types';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { PageIntro } from '@/components/PageIntro';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { ApiError, getApiErrorMessage } from '@/services/api/api-error';

import { useUpdateUserMutation, useUsersQuery } from '../hooks/use-users';
import type { EditUserFormValues } from '../types/users';
import { UserForm } from './UserForm';
import { UsersAccessState } from './UsersAccessState';
import { UsersErrorState } from './UsersErrorState';

export function UserEditPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const currentSessionQuery = useCurrentSessionQuery();
  const usersQuery = useUsersQuery();
  const updateUserMutation = useUpdateUserMutation(params.userId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: EditUserFormValues) {
    if (
      currentSessionQuery.isError ||
      currentSessionQuery.isPending ||
      usersQuery.isError ||
      usersQuery.isPending
    ) {
      return;
    }

    setErrorMessage(null);

    const actor = currentSessionQuery.data.user;
    const payload =
      actor.id === params.userId
        ? {
            name: values.name,
          }
        : values;

    try {
      await updateUserMutation.mutateAsync(payload);
      router.replace('/users?success=updated');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update this user right now.'));
    }
  }

  if (currentSessionQuery.isPending || usersQuery.isPending) {
    return (
      <LoadingScreen
        description="Loading the selected team member and your access level."
        title="Loading user details"
      />
    );
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update role assignments and team member information without leaving the private workspace."
          eyebrow="Users"
          title="Edit user"
        />
        <UsersErrorState
          message={getApiErrorMessage(
            currentSessionQuery.error,
            'Unable to load your current access context.',
          )}
        />
      </div>
    );
  }

  const actor = currentSessionQuery.data.user;

  if (actor.role === UserRole.SALES_REP) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update role assignments and team member information without leaving the private workspace."
          eyebrow="Users"
          title="Edit user"
        />
        <UsersAccessState />
      </div>
    );
  }

  if (usersQuery.isError) {
    if (usersQuery.error instanceof ApiError && usersQuery.error.status === 403) {
      return (
        <div className="space-y-6">
          <PageIntro
            description="Update role assignments and team member information without leaving the private workspace."
            eyebrow="Users"
            title="Edit user"
          />
          <UsersAccessState />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PageIntro
          description="Update role assignments and team member information without leaving the private workspace."
          eyebrow="Users"
          title="Edit user"
        />
        <UsersErrorState
          message={getApiErrorMessage(usersQuery.error, 'Unable to load this user.')}
        />
      </div>
    );
  }

  const user = usersQuery.data.users.find((item) => item.id === params.userId);

  if (!user) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update role assignments and team member information without leaving the private workspace."
          eyebrow="Users"
          title="Edit user"
        />
        <UsersErrorState message="This user could not be found in the current organization." />
      </div>
    );
  }

  if (actor.role === UserRole.MANAGER && user.role === UserRole.OWNER) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update role assignments and team member information without leaving the private workspace."
          eyebrow="Users"
          title={`Edit ${user.name}`}
        />
        <UsersAccessState
          description="Managers can update managers and sales reps, but owner accounts remain restricted to preserve workspace control."
          title="This user can only be managed by an owner."
        />
      </div>
    );
  }

  const isEditingCurrentUser = actor.id === user.id;

  return (
    <div className="space-y-6">
      <PageIntro
        description="Update role assignments and team member information without leaving the private workspace."
        eyebrow="Users"
        title={`Edit ${user.name}`}
      />
      <UserForm
        actorRole={actor.role}
        disableRoleField={isEditingCurrentUser}
        errorMessage={errorMessage}
        isSubmitting={updateUserMutation.isPending}
        mode="edit"
        onSubmit={handleSubmit}
        roleHint={
          isEditingCurrentUser
            ? 'You can update your name here, but your own role stays locked.'
            : undefined
        }
        submitLabel="Save changes"
        user={user}
      />
    </div>
  );
}
