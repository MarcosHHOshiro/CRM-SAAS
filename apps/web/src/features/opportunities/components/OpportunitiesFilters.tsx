'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';

type OpportunitiesFiltersProps = Readonly<{
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  ownerOptions: Array<{ label: string; value: string }>;
  showOwnerFilter: boolean;
  sortOptions: Array<{ label: string; value: string }>;
  stageOptions: Array<{ label: string; value: string }>;
  statusOptions: Array<{ label: string; value: string }>;
  values: {
    ownerUserId: string;
    search: string;
    sortKey: string;
    stage: string;
    status: string;
  };
}>;

export function OpportunitiesFilters({
  onChange,
  onReset,
  onSubmit,
  ownerOptions,
  showOwnerFilter,
  sortOptions,
  stageOptions,
  statusOptions,
  values,
}: OpportunitiesFiltersProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {locale === 'pt-BR' ? 'Diretorio de oportunidades' : 'Opportunity directory'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            href="/opportunities/pipeline"
          >
            {messages.opportunities.filters.openPipeline}
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/opportunities/new"
          >
            {messages.opportunities.filters.createButton}
          </Link>
        </div>
      </div>

      <form
        className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr_auto]"
        onSubmit={onSubmit}
      >
        <TextField
          label={messages.opportunities.filters.searchLabel}
          name="search"
          onChange={onChange}
          placeholder={messages.opportunities.filters.searchPlaceholder}
          value={values.search}
        />
        <SelectField
          label={messages.opportunities.filters.stageLabel}
          name="stage"
          onChange={onChange}
          options={stageOptions}
          value={values.stage}
        />
        <SelectField
          label={messages.opportunities.filters.statusLabel}
          name="status"
          onChange={onChange}
          options={statusOptions}
          value={values.status}
        />
        {showOwnerFilter ? (
          <SelectField
            label={messages.opportunities.filters.ownerLabel}
            name="ownerUserId"
            onChange={onChange}
            options={ownerOptions}
            value={values.ownerUserId}
          />
        ) : (
          <SelectField
            label={messages.opportunities.filters.sortLabel}
            name="sortKey"
            onChange={onChange}
            options={sortOptions}
            value={values.sortKey}
          />
        )}
        <div className="flex items-end gap-3">
          {showOwnerFilter ? (
            <SelectField
              label={messages.opportunities.filters.sortLabel}
              name="sortKey"
              onChange={onChange}
              options={sortOptions}
              value={values.sortKey}
            />
          ) : null}
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            type="submit"
          >
            {messages.common.actions.apply}
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onReset}
            type="button"
          >
            {messages.common.actions.reset}
          </button>
        </div>
      </form>
    </section>
  );
}
