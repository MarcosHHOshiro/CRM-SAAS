import Link from 'next/link';

type LeadsEmptyStateProps = Readonly<{
  hasFilters: boolean;
}>;

export function LeadsEmptyState({ hasFilters }: LeadsEmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Leads</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {hasFilters ? 'Nenhum lead corresponde aos filtros atuais.' : 'Nenhum lead criado ainda.'}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {hasFilters
          ? 'Tente ampliar a busca ou limpar os filtros de status e responsavel.'
          : 'Comece criando seu primeiro lead para alimentar o pipeline e acompanhar as primeiras oportunidades.'}
      </p>
      {!hasFilters ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/leads/new"
        >
          Criar primeiro lead
        </Link>
      ) : null}
    </section>
  );
}
