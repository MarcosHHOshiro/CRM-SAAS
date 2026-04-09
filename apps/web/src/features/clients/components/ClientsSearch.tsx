'use client';

import Link from 'next/link';

import { TextField } from '@/components/TextField';
import { useTranslation } from '@/i18n/use-translation';

type ClientsSearchProps = Readonly<{
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  value: string;
}>;

export function ClientsSearch({ onChange, onReset, onSubmit, value }: ClientsSearchProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.clients.search.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{messages.clients.search.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.clients.search.description}
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/clients/new"
        >
          {messages.clients.search.createButton}
        </Link>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_auto]" onSubmit={onSubmit}>
        <TextField
          label={messages.clients.search.fieldLabel}
          name="search"
          onChange={onChange}
          placeholder={messages.clients.search.fieldPlaceholder}
          value={value}
        />
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
