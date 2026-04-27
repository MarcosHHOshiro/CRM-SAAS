'use client';

import Link from 'next/link';
import { EmptyStateIcon } from '@/components/EmptyStateIcon';
import { useTranslation } from '@/i18n/use-translation';

type ClientsEmptyStateProps = Readonly<{
  hasFilters: boolean;
  onReset?: () => void;
}>;

export function ClientsEmptyState({ hasFilters, onReset }: ClientsEmptyStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-lg border border-dashed border-[var(--border)] bg-[color:rgb(var(--card-dark-rgb)/0.6)] p-10 text-center shadow-[var(--shadow-soft)]">
      <EmptyStateIcon />
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        {messages.clients.empty.eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
        {hasFilters ? messages.clients.empty.noResultsTitle : messages.clients.empty.noItemsTitle}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {hasFilters
          ? messages.clients.empty.noResultsDescription
          : messages.clients.empty.noItemsDescription}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {!hasFilters ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/clients/new"
          >
            {messages.clients.empty.createButton}
          </Link>
        ) : null}
        {hasFilters && onReset ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onReset}
            type="button"
          >
            {messages.common.actions.reset}
          </button>
        ) : null}
      </div>
    </section>
  );
}
