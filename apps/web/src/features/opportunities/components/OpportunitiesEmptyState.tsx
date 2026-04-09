import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

type OpportunitiesEmptyStateProps = Readonly<{
  hasFilters: boolean;
}>;

export function OpportunitiesEmptyState({ hasFilters }: OpportunitiesEmptyStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.opportunities.empty.eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {hasFilters ? messages.opportunities.empty.noResultsTitle : messages.opportunities.empty.noItemsTitle}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {hasFilters
          ? messages.opportunities.empty.noResultsDescription
          : messages.opportunities.empty.noItemsDescription}
      </p>
      {!hasFilters ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/opportunities/new"
        >
          {messages.opportunities.empty.createButton}
        </Link>
      ) : null}
    </section>
  );
}
