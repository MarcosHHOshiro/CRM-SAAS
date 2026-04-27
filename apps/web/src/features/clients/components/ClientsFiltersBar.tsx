'use client';

import { useTranslation } from '@/i18n/use-translation';

import type { ClientOriginFilter, ClientOwnershipFilter, ClientPeriodFilter } from '../types/clients';

type ClientsFiltersBarProps = Readonly<{
  onChangeOrigin: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeOwnership: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangePeriod: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  originValue: ClientOriginFilter;
  ownershipValue: ClientOwnershipFilter;
  periodValue: ClientPeriodFilter;
  searchValue: string;
}>;

export function ClientsFiltersBar({
  onChangeOrigin,
  onChangeOwnership,
  onChangePeriod,
  onChangeSearch,
  onReset,
  onSubmit,
  originValue,
  ownershipValue,
  periodValue,
  searchValue,
}: ClientsFiltersBarProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 sm:px-4">
      <form
        className="grid gap-3 xl:grid-cols-[minmax(0,1.7fr)_1fr_1fr_1fr_auto_auto] xl:items-end"
        onSubmit={onSubmit}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[var(--foreground-muted)]">
            {locale === 'pt-BR' ? 'Buscar' : 'Search'}
          </span>
          <input
            className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)]"
            name="search"
            onChange={onChangeSearch}
            placeholder={messages.clients.search.fieldPlaceholder}
            value={searchValue}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[var(--foreground-muted)]">
            {locale === 'pt-BR' ? 'Status' : 'Status'}
          </span>
          <select
            className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)]"
            name="ownership"
            onChange={onChangeOwnership}
            value={ownershipValue}
          >
            <option value="all">{locale === 'pt-BR' ? 'Todos' : 'All'}</option>
            <option value="assigned">{locale === 'pt-BR' ? 'Com responsavel' : 'Assigned'}</option>
            <option value="unassigned">
              {locale === 'pt-BR' ? 'Sem responsavel' : 'Unassigned'}
            </option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[var(--foreground-muted)]">
            {locale === 'pt-BR' ? 'Segmento' : 'Segment'}
          </span>
          <select
            className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)]"
            name="origin"
            onChange={onChangeOrigin}
            value={originValue}
          >
            <option value="all">{locale === 'pt-BR' ? 'Todos' : 'All'}</option>
            <option value="lead">{locale === 'pt-BR' ? 'Lead convertido' : 'Converted lead'}</option>
            <option value="direct">{locale === 'pt-BR' ? 'Cadastro direto' : 'Direct record'}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[var(--foreground-muted)]">
            {locale === 'pt-BR' ? 'Data' : 'Date'}
          </span>
          <select
            className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)]"
            name="period"
            onChange={onChangePeriod}
            value={periodValue}
          >
            <option value="all">{locale === 'pt-BR' ? 'Todo o periodo' : 'All time'}</option>
            <option value="30d">{locale === 'pt-BR' ? 'Ultimos 30 dias' : 'Last 30 days'}</option>
            <option value="90d">{locale === 'pt-BR' ? 'Ultimos 90 dias' : 'Last 90 days'}</option>
            <option value="365d">
              {locale === 'pt-BR' ? 'Ultimos 12 meses' : 'Last 12 months'}
            </option>
          </select>
        </label>

        <button
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          type="submit"
        >
          {messages.common.actions.apply}
        </button>

        <button
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          onClick={onReset}
          type="button"
        >
          {messages.common.actions.reset}
        </button>
      </form>
    </section>
  );
}
