'use client';

import Link from 'next/link';

import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';

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
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Filtros de leads</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Lista de leads do pipeline</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Busque e filtre leads da organizacao atual, depois crie, atualize, converta ou remova registros.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href="/leads/new"
        >
          Criar lead
        </Link>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr_auto]" onSubmit={onSubmit}>
        <TextField
          label="Busca"
          name="search"
          onChange={onChange}
          placeholder="Nome, email, empresa ou telefone"
          value={values.search}
        />
        <SelectField
          label="Status"
          name="status"
          onChange={onChange}
          options={[
            { label: 'Todos os status', value: '' },
            { label: 'Novo', value: 'NEW' },
            { label: 'Qualificado', value: 'QUALIFIED' },
            { label: 'Contatado', value: 'CONTACTED' },
            { label: 'Convertido', value: 'CONVERTED' },
            { label: 'Perdido', value: 'LOST' },
          ]}
          value={values.status}
        />
        {showOwnerFilter ? (
          <SelectField
            label="Responsavel"
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
            Aplicar
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onReset}
            type="button"
          >
            Limpar
          </button>
        </div>
      </form>
    </section>
  );
}
