import Link from 'next/link';

type OpportunitiesEmptyStateProps = Readonly<{
  hasFilters: boolean;
}>;

export function OpportunitiesEmptyState({ hasFilters }: OpportunitiesEmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Opportunities</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {hasFilters ? 'No opportunities match the current filters.' : 'No opportunities created yet.'}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {hasFilters
          ? 'Try broadening the search or clearing the stage, status, or owner filters.'
          : 'Create your first opportunity to start tracking pipeline value and stage movement.'}
      </p>
      {!hasFilters ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/opportunities/new"
        >
          Create first opportunity
        </Link>
      ) : null}
    </section>
  );
}
