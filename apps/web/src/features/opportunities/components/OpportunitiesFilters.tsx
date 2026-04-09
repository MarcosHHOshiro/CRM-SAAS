'use client';

import Link from 'next/link';

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
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Opportunity filters
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Pipeline opportunity list
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Filter opportunities by stage, status, and owner while keeping the pipeline organized.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            href="/opportunities/pipeline"
          >
            Open pipeline
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/opportunities/new"
          >
            Create opportunity
          </Link>
        </div>
      </div>

      <form
        className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr_auto]"
        onSubmit={onSubmit}
      >
        <TextField
          label="Search"
          name="search"
          onChange={onChange}
          placeholder="Title or client details"
          value={values.search}
        />
        <SelectField
          label="Stage"
          name="stage"
          onChange={onChange}
          options={stageOptions}
          value={values.stage}
        />
        <SelectField
          label="Status"
          name="status"
          onChange={onChange}
          options={statusOptions}
          value={values.status}
        />
        {showOwnerFilter ? (
          <SelectField
            label="Owner"
            name="ownerUserId"
            onChange={onChange}
            options={ownerOptions}
            value={values.ownerUserId}
          />
        ) : (
          <SelectField
            label="Sort"
            name="sortKey"
            onChange={onChange}
            options={sortOptions}
            value={values.sortKey}
          />
        )}
        <div className="flex items-end gap-3">
          {showOwnerFilter ? (
            <SelectField
              label="Sort"
              name="sortKey"
              onChange={onChange}
              options={sortOptions}
              value={values.sortKey}
            />
          ) : null}
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            type="submit"
          >
            Apply
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
