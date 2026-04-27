import Link from 'next/link';
import { EmptyStateIcon } from '@/components/EmptyStateIcon';
import { useTranslation } from '@/i18n/use-translation';

type OpportunitiesEmptyStateProps = Readonly<{
  hasFilters: boolean;
}>;

export function OpportunitiesEmptyState({ hasFilters }: OpportunitiesEmptyStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-lg border border-dashed border-[var(--border)] bg-[color:rgb(var(--card-dark-rgb)/0.6)] p-10 text-center shadow-[var(--shadow-soft)]">
      <EmptyStateIcon />
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{messages.opportunities.empty.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
        {hasFilters ? messages.opportunities.empty.noResultsTitle : messages.opportunities.empty.noItemsTitle}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {hasFilters
          ? messages.opportunities.empty.noResultsDescription
          : messages.opportunities.empty.noItemsDescription}
      </p>
      {!hasFilters ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/opportunities/new"
        >
          {messages.opportunities.empty.createButton}
        </Link>
      ) : null}
    </section>
  );
}
