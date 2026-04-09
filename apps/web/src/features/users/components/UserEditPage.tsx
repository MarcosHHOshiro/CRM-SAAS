'use client';

import { UserRole } from '@crm-saas/types';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { PageIntro } from '@/components/PageIntro';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { useTranslation } from '@/i18n/use-translation';
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
  const { messages } = useTranslation();

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
      setErrorMessage(getApiErrorMessage(error, messages.users.edit.errorFallback));
    }
  }

  if (currentSessionQuery.isPending || usersQuery.isPending) {
    return (
      <LoadingScreen
        description={messages.users.edit.loadingDescription}
        title={messages.users.edit.loadingTitle}
      />
    );
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.edit.description}
          eyebrow={messages.users.edit.eyebrow}
          title={messages.users.edit.title}
        />
        <UsersErrorState
          message={getApiErrorMessage(
            currentSessionQuery.error,
            messages.users.list.currentAccessError,
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
          description={messages.users.edit.description}
          eyebrow={messages.users.edit.eyebrow}
          title={messages.users.edit.title}
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
            description={messages.users.edit.description}
            eyebrow={messages.users.edit.eyebrow}
            title={messages.users.edit.title}
          />
          <UsersAccessState />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.edit.description}
          eyebrow={messages.users.edit.eyebrow}
          title={messages.users.edit.title}
        />
        <UsersErrorState
          message={getApiErrorMessage(usersQuery.error, messages.users.edit.loadError)}
        />
      </div>
    );
  }

  const user = usersQuery.data.users.find((item) => item.id === params.userId);

  if (!user) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.edit.description}
          eyebrow={messages.users.edit.eyebrow}
          title={messages.users.edit.title}
        />
        <UsersErrorState message={messages.users.edit.notFound} />
      </div>
    );
  }

  if (actor.role === UserRole.MANAGER && user.role === UserRole.OWNER) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.edit.description}
          eyebrow={messages.users.edit.eyebrow}
          title={messages.users.edit.titleWithName.replace('{name}', user.name)}
        />
        <UsersAccessState
          description={messages.users.access.ownerOnlyDescription}
          title={messages.users.access.ownerOnlyTitle}
        />
      </div>
    );
  }

  const isEditingCurrentUser = actor.id === user.id;

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.users.edit.description}
        eyebrow={messages.users.edit.eyebrow}
        title={messages.users.edit.titleWithName.replace('{name}', user.name)}
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
            ? messages.users.edit.selfRoleHint
            : undefined
        }
        submitLabel={messages.users.edit.submit}
        user={user}
      />
    </div>
  );
}
