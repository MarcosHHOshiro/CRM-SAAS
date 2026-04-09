'use client';

import Link from 'next/link';
import { UserRole } from '@crm-saas/types';
import { useTranslation } from '@/i18n/use-translation';

import { formatUserDate } from '../lib/users-format';
import type { UserRecord } from '../types/users';

import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';

type UsersTableProps = Readonly<{
  actorRole: UserRole;
  currentUserId: string;
  isUpdatingStatusUserId?: string | null;
  onToggleStatus: (user: UserRecord) => void;
  users: UserRecord[];
}>;

export function UsersTable({
  actorRole,
  currentUserId,
  isUpdatingStatusUserId,
  onToggleStatus,
  users,
}: UsersTableProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] text-left">
          <thead className="border-b border-[var(--border)] bg-white/65">
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">{messages.users.table.user}</th>
              <th className="px-6 py-4 font-semibold">{messages.users.table.role}</th>
              <th className="px-6 py-4 font-semibold">{messages.users.table.status}</th>
              <th className="px-6 py-4 font-semibold">{messages.users.table.createdAt}</th>
              <th className="px-6 py-4 font-semibold">{messages.users.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isOwnerLocked = actorRole === UserRole.MANAGER && user.role === UserRole.OWNER;
              const canEdit = !isOwnerLocked;
              const canToggleStatus = !isCurrentUser && !isOwnerLocked;
              const nextStatusLabel = user.isActive
                ? messages.users.table.deactivate
                : messages.users.table.activate;

              return (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="px-6 py-5 align-top">
                    <div>
                      <p className="text-base font-semibold text-[var(--foreground)]">{user.name}</p>
                      <div className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
                        <p>{user.email}</p>
                        {isCurrentUser ? <p>{messages.users.table.currentSessionUser}</p> : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-5 align-top">
                    <UserStatusBadge isActive={user.isActive} />
                  </td>
                  <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                    {formatUserDate(user.createdAt, locale)}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-wrap gap-2">
                      {canEdit ? (
                        <Link
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          href={`/users/${user.id}/edit`}
                        >
                          {messages.common.actions.edit}
                        </Link>
                      ) : (
                        <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-slate-50 px-4 text-sm font-semibold text-[var(--foreground-muted)]">
                          {messages.users.table.restricted}
                        </span>
                      )}
                      <button
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={!canToggleStatus || isUpdatingStatusUserId === user.id}
                        onClick={() => onToggleStatus(user)}
                        type="button"
                      >
                        {isUpdatingStatusUserId === user.id
                          ? messages.users.table.updating
                          : isOwnerLocked
                            ? messages.users.table.ownerLocked
                            : isCurrentUser
                              ? messages.users.table.currentUser
                              : nextStatusLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
