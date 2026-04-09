'use client';

import { UserRole } from '@crm-saas/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { PageIntro } from '@/components/PageIntro';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useCreateUserMutation } from '../hooks/use-users';
import type { UserFormValues } from '../types/users';
import { UserForm } from './UserForm';
import { UsersAccessState } from './UsersAccessState';
import { UsersErrorState } from './UsersErrorState';

export function UserCreatePage() {
  const router = useRouter();
  const currentSessionQuery = useCurrentSessionQuery();
  const createUserMutation = useCreateUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: UserFormValues) {
    setErrorMessage(null);

    try {
      await createUserMutation.mutateAsync(values);
      router.replace('/users?success=created');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to create this user right now.'));
    }
  }

  if (currentSessionQuery.isPending) {
    return (
      <LoadingScreen
        description="Checking your access level before opening the team administration flow."
        title="Loading user form"
      />
    );
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Invite or create an internal team member and assign the right role for your workspace."
          eyebrow="Users"
          title="Create user"
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

  if (currentSessionQuery.data.user.role === UserRole.SALES_REP) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Invite or create an internal team member and assign the right role for your workspace."
          eyebrow="Users"
          title="Create user"
        />
        <UsersAccessState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Invite or create an internal team member and assign the right role for your workspace."
        eyebrow="Users"
        title="Create user"
      />
      <UserForm
        actorRole={currentSessionQuery.data.user.role}
        errorMessage={errorMessage}
        isSubmitting={createUserMutation.isPending}
        mode="create"
        onSubmit={handleSubmit}
        submitLabel="Create user"
      />
    </div>
  );
}
