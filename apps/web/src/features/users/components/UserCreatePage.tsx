'use client';

import { UserRole } from '@crm-saas/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { PageIntro } from '@/components/PageIntro';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { useTranslation } from '@/i18n/use-translation';
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
  const { messages } = useTranslation();

  async function handleSubmit(values: UserFormValues) {
    setErrorMessage(null);

    try {
      await createUserMutation.mutateAsync(values);
      router.replace('/users?success=created');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, messages.users.create.errorFallback));
    }
  }

  if (currentSessionQuery.isPending) {
    return (
      <LoadingScreen
        description={messages.users.create.loadingDescription}
        title={messages.users.create.loadingTitle}
      />
    );
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.create.description}
          eyebrow={messages.users.create.eyebrow}
          title={messages.users.create.title}
        />
        <UsersErrorState
          message={getApiErrorMessage(
            currentSessionQuery.error,
            messages.users.create.loadError,
          )}
        />
      </div>
    );
  }

  if (currentSessionQuery.data.user.role === UserRole.SALES_REP) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.create.description}
          eyebrow={messages.users.create.eyebrow}
          title={messages.users.create.title}
        />
        <UsersAccessState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.users.create.description}
        eyebrow={messages.users.create.eyebrow}
        title={messages.users.create.title}
      />
      <UserForm
        actorRole={currentSessionQuery.data.user.role}
        errorMessage={errorMessage}
        isSubmitting={createUserMutation.isPending}
        mode="create"
        onSubmit={handleSubmit}
        submitLabel={messages.users.create.submit}
      />
    </div>
  );
}
