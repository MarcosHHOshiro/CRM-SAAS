'use client';

import Link from 'next/link';
import { UserRole } from '@crm-saas/types';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PageIntro } from '@/components/PageIntro';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { ApiError, getApiErrorMessage } from '@/services/api/api-error';

import { useUpdateUserStatusMutation, useUsersQuery } from '../hooks/use-users';
import { getUsersSuccessMessage } from '../lib/users-format';
import type { UserRecord } from '../types/users';
import { UsersAccessState } from './UsersAccessState';
import { UsersEmptyState } from './UsersEmptyState';
import { UsersErrorState } from './UsersErrorState';
import { UsersListSkeleton } from './UsersListSkeleton';
import { UsersTable } from './UsersTable';

export function UsersListPage() {
  const searchParams = useSearchParams();
  const currentSessionQuery = useCurrentSessionQuery();
  const usersQuery = useUsersQuery();
  const updateUserStatusMutation = useUpdateUserStatusMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const successMessage = getUsersSuccessMessage(searchParams.get('success'));

  async function handleToggleStatus(user: UserRecord) {
    setErrorMessage(null);

    try {
      await updateUserStatusMutation.mutateAsync({
        isActive: !user.isActive,
        userId: user.id,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'Unable to update this user status right now.'),
      );
    }
  }

  if (currentSessionQuery.isPending || usersQuery.isPending) {
    return <UsersListSkeleton />;
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Manage your internal team with clear role visibility, status controls, and fast user administration."
          eyebrow="Users"
          title="Team administration"
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
          description="Manage your internal team with clear role visibility, status controls, and fast user administration."
          eyebrow="Users"
          title="Team administration"
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
            description="Manage your internal team with clear role visibility, status controls, and fast user administration."
            eyebrow="Users"
            title="Team administration"
          />
          <UsersAccessState />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PageIntro
          description="Manage your internal team with clear role visibility, status controls, and fast user administration."
          eyebrow="Users"
          title="Team administration"
        />
        <UsersErrorState
          message={getApiErrorMessage(
            usersQuery.error,
            'Please try loading the team members again.',
          )}
          onRetry={() => {
            void usersQuery.refetch();
          }}
        />
      </div>
    );
  }

  const users = usersQuery.data.users;
  const activeUsersCount = users.filter((user) => user.isActive).length;
  const inactiveUsersCount = users.length - activeUsersCount;

  return (
    <div className="space-y-6">
      <PageIntro
        description="Manage your internal team with clear role visibility, status controls, and fast user administration."
        eyebrow="Users"
        title="Team administration"
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.7rem] border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              Total users
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{users.length}</p>
          </div>
          <div className="rounded-[1.7rem] border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              Active
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {activeUsersCount}
            </p>
          </div>
          <div className="rounded-[1.7rem] border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              Inactive
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {inactiveUsersCount}
            </p>
          </div>
        </div>
        <section className="flex items-center justify-between gap-4 rounded-[1.7rem] border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Add managers and sales reps as your workspace grows.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Roles and activation state stay aligned with the backend authorization rules.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/users/new"
          >
            Create user
          </Link>
        </section>
      </section>

      {successMessage ? <InlineBanner tone="success">{successMessage}</InlineBanner> : null}
      {errorMessage ? <InlineBanner tone="error">{errorMessage}</InlineBanner> : null}

      {users.length === 0 ? (
        <UsersEmptyState />
      ) : (
        <UsersTable
          actorRole={actor.role}
          currentUserId={actor.id}
          isUpdatingStatusUserId={
            updateUserStatusMutation.isPending
              ? updateUserStatusMutation.variables?.userId ?? null
              : null
          }
          onToggleStatus={handleToggleStatus}
          users={users}
        />
      )}
    </div>
  );
}
