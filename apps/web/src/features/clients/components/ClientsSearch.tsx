'use client';

import Link from 'next/link';

import { TextField } from '@/components/TextField';

type ClientsSearchProps = Readonly<{
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  value: string;
}>;

export function ClientsSearch({ onChange, onReset, onSubmit, value }: ClientsSearchProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Client search</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Customer directory</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Search client records by name, email, company, or phone number across the current organization.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/clients/new"
        >
          Create client
        </Link>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_auto]" onSubmit={onSubmit}>
        <TextField
          label="Search"
          name="search"
          onChange={onChange}
          placeholder="Name, email, company, or phone"
          value={value}
        />
        <div className="flex items-end gap-3">
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
