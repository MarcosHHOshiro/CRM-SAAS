'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

type ClientsEmptyStateProps = Readonly<{
  hasFilters: boolean;
  onReset?: () => void;
}>;

export function ClientsEmptyState({ hasFilters, onReset }: ClientsEmptyStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
        {messages.clients.empty.eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
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
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/clients/new"
          >
            {messages.clients.empty.createButton}
          </Link>
        ) : null}
        {hasFilters && onReset ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
