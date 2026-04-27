'use client';

import Link from 'next/link';
import { UserRole } from '@crm-saas/types';
import { useRouter, useSearchParams } from 'next/navigation';

import { PaginationControls } from '@/components/PaginationControls';
import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { useTranslation } from '@/i18n/use-translation';
import { buildPageQueryString, getPageFromSearchParams, paginateItems } from '@/lib/pagination';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionQuery = useCurrentSessionQuery();
  const usersQuery = useUsersQuery();
  const updateUserStatusMutation = useUpdateUserStatusMutation();
  const { showToast } = useToast();
  const { messages } = useTranslation();
  const successMessage = getUsersSuccessMessage(searchParams.get('success'), messages);
  const currentPage = getPageFromSearchParams(searchParams);

  useQueryFeedbackToast(successMessage);

  async function handleToggleStatus(user: UserRecord) {
    try {
      await updateUserStatusMutation.mutateAsync({
        isActive: !user.isActive,
        userId: user.id,
      });
      showToast({
        message: user.isActive
          ? messages.users.list.statusDeactivated
          : messages.users.list.statusActivated,
        tone: 'success',
      });
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error, messages.users.list.statusUpdateError),
        tone: 'error',
      });
    }
  }

  function handlePageChange(page: number) {
    const queryString = buildPageQueryString(searchParams, page);

    router.replace(queryString ? `/users?${queryString}` : '/users');
  }

  if (currentSessionQuery.isPending || usersQuery.isPending) {
    return <UsersListSkeleton />;
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.list.description}
          eyebrow={messages.users.list.eyebrow}
          title={messages.users.list.title}
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
          description={messages.users.list.description}
          eyebrow={messages.users.list.eyebrow}
          title={messages.users.list.title}
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
            description={messages.users.list.description}
            eyebrow={messages.users.list.eyebrow}
            title={messages.users.list.title}
          />
          <UsersAccessState />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.users.list.description}
          eyebrow={messages.users.list.eyebrow}
          title={messages.users.list.title}
        />
        <UsersErrorState
          message={getApiErrorMessage(
            usersQuery.error,
            messages.users.list.errorFallback,
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
  const paginatedUsers = paginateItems(users, currentPage, 10);

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.users.list.description}
        eyebrow={messages.users.list.eyebrow}
        title={messages.users.list.title}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              {messages.users.list.total}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{users.length}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              {messages.users.list.active}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {activeUsersCount}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              {messages.users.list.inactive}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {inactiveUsersCount}
            </p>
          </div>
        </div>
        <section className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {messages.users.list.ctaTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {messages.users.list.ctaDescription}
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/users/new"
          >
            {messages.users.list.createButton}
          </Link>
        </section>
      </section>

      {users.length === 0 ? (
        <UsersEmptyState />
      ) : (
        <>
          <UsersTable
            actorRole={actor.role}
            currentUserId={actor.id}
            isUpdatingStatusUserId={
              updateUserStatusMutation.isPending
                ? updateUserStatusMutation.variables?.userId ?? null
                : null
            }
            onToggleStatus={handleToggleStatus}
            users={paginatedUsers.items}
          />
          <PaginationControls
            currentPage={paginatedUsers.currentPage}
            itemLabel={messages.users.list.itemLabel}
            onPageChange={handlePageChange}
            pageSize={10}
            totalItems={paginatedUsers.totalItems}
            totalPages={paginatedUsers.totalPages}
          />
        </>
      )}
    </div>
  );
}
