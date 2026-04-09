'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { getLeadStatusOptions } from '../lib/leads-format';

type LeadsFiltersProps = Readonly<{
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  ownerOptions: Array<{ label: string; value: string }>;
  showOwnerFilter: boolean;
  values: {
    ownerUserId: string;
    search: string;
    status: string;
  };
}>;

export function LeadsFilters({
  onChange,
  onReset,
  onSubmit,
  ownerOptions,
  showOwnerFilter,
  values,
}: LeadsFiltersProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.leads.filters.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{messages.leads.filters.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.leads.filters.description}
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/leads/new"
        >
          {messages.leads.filters.createButton}
        </Link>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr_auto]" onSubmit={onSubmit}>
        <TextField
          label={messages.leads.filters.searchLabel}
          name="search"
          onChange={onChange}
          placeholder={messages.leads.filters.searchPlaceholder}
          value={values.search}
        />
        <SelectField
          label={messages.leads.filters.statusLabel}
          name="status"
          onChange={onChange}
          options={getLeadStatusOptions(messages).map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          value={values.status}
        />
        {showOwnerFilter ? (
          <SelectField
            label={messages.leads.filters.ownerLabel}
            name="ownerUserId"
            onChange={onChange}
            options={ownerOptions}
            value={values.ownerUserId}
          />
        ) : (
          <div />
        )}
        <div className="flex items-end gap-3">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            type="submit"
          >
            {messages.common.actions.apply}
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
