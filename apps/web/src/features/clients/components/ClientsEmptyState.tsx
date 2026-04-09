import Link from 'next/link';

type ClientsEmptyStateProps = Readonly<{
  hasFilters: boolean;
}>;

export function ClientsEmptyState({ hasFilters }: ClientsEmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Clients</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {hasFilters ? 'No clients match the current search.' : 'No clients created yet.'}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {hasFilters
          ? 'Try broadening the search to include another name, email, company, or phone.'
          : 'Create your first client to start building the customer directory for this organization.'}
      </p>
      {!hasFilters ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/clients/new"
        >
          Create first client
        </Link>
      ) : null}
    </section>
  );
}
