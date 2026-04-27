'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { useTranslation } from '@/i18n/use-translation';
import { buildPageQueryString, getPageFromSearchParams, paginateItems } from '@/lib/pagination';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  buildClientFilters,
  buildClientFiltersQueryString,
  filterClients,
  getClientsMetrics,
  getClientSuccessMessage,
} from '../lib/clients-format';
import { useClientsQuery } from '../hooks/use-clients';
import { ClientsEmptyState } from './ClientsEmptyState';
import { ClientsErrorState } from './ClientsErrorState';
import { ClientsFiltersBar } from './ClientsFiltersBar';
import { ClientsListSkeleton } from './ClientsListSkeleton';
import { ClientsMetrics } from './ClientsMetrics';
import { ClientsTable } from './ClientsTable';

export function ClientsListPage() {
  const { locale, messages } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => buildClientFilters(searchParams), [searchParams]);
  const clientsQuery = useClientsQuery(filters);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');
  const [ownershipValue, setOwnershipValue] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [originValue, setOriginValue] = useState<'all' | 'lead' | 'direct'>('all');
  const [periodValue, setPeriodValue] = useState<'all' | '30d' | '90d' | '365d'>('all');

  useEffect(() => {
    setSearchValue(searchParams.get('search') ?? '');
  }, [searchParams]);

  const successMessage = getClientSuccessMessage(searchParams.get('success'), messages);
  const currentPage = getPageFromSearchParams(searchParams);

  useQueryFeedbackToast(successMessage);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  function handleOwnershipChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setOwnershipValue(event.target.value as 'all' | 'assigned' | 'unassigned');
  }

  function handleOriginChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setOriginValue(event.target.value as 'all' | 'lead' | 'direct');
  }

  function handlePeriodChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setPeriodValue(event.target.value as 'all' | '30d' | '90d' | '365d');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const queryString = buildClientFiltersQueryString({ search: searchValue });

    router.replace(queryString ? `/clients?${queryString}` : '/clients');
  }

  function handleReset() {
    setSearchValue('');
    setOwnershipValue('all');
    setOriginValue('all');
    setPeriodValue('all');
    router.replace('/clients');
  }

  function handlePageChange(page: number) {
    const queryString = buildPageQueryString(searchParams, page);

    router.replace(queryString ? `/clients?${queryString}` : '/clients');
  }

  function handleExport() {
    if (!clientsQuery.data?.clients.length) {
      return;
    }

    const filteredClients = filterClients(clientsQuery.data.clients, {
      origin: originValue,
      ownership: ownershipValue,
      period: periodValue,
    });

    const rows = [
      [
        locale === 'pt-BR' ? 'Nome' : 'Name',
        locale === 'pt-BR' ? 'Empresa' : 'Company',
        'Email',
        locale === 'pt-BR' ? 'Telefone' : 'Phone',
        locale === 'pt-BR' ? 'Responsavel' : 'Owner',
        locale === 'pt-BR' ? 'Origem' : 'Origin',
        locale === 'pt-BR' ? 'Cadastro' : 'Created at',
      ],
      ...filteredClients.map((client) => [
        client.name,
        client.company ?? '',
        client.email ?? '',
        client.phone ?? '',
        client.owner?.name ?? messages.clients.table.unassigned,
        client.sourceLead
          ? locale === 'pt-BR'
            ? 'Lead convertido'
            : 'Converted lead'
          : messages.clients.table.createdDirectly,
        client.createdAt,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = locale === 'pt-BR' ? 'clientes.csv' : 'clients.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  if (clientsQuery.isPending) {
    return <ClientsListSkeleton />;
  }

  if (clientsQuery.isError) {
    return (
      <div className="space-y-4">
        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-5">
          <p className="text-xs text-[var(--foreground-muted)]">
            Workspace / {messages.clients.list.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {messages.clients.list.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.clients.list.description}
          </p>
        </section>
        <ClientsErrorState
          message={getApiErrorMessage(clientsQuery.error, messages.clients.list.errorFallback)}
          onRetry={() => {
            void clientsQuery.refetch();
          }}
        />
      </div>
    );
  }

  const filteredClients = filterClients(clientsQuery.data.clients, {
    origin: originValue,
    ownership: ownershipValue,
    period: periodValue,
  });
  const metrics = getClientsMetrics(filteredClients);
  const paginatedClients = paginateItems(filteredClients, currentPage, 10);
  const hasFilters =
    Boolean(filters.search) ||
    ownershipValue !== 'all' ||
    originValue !== 'all' ||
    periodValue !== 'all';

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Workspace / {messages.clients.list.eyebrow}
            </p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
              {locale === 'pt-BR' ? 'Clientes' : 'Clients'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)]">
              {messages.clients.list.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              onClick={handleExport}
              type="button"
            >
              {locale === 'pt-BR' ? 'Exportar' : 'Export'}
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
              onClick={() => {
                router.push('/clients/new');
              }}
              type="button"
            >
              <span aria-hidden="true" className="text-base leading-none">
                +
              </span>
              {locale === 'pt-BR' ? 'Novo cliente' : 'New client'}
            </button>
          </div>
        </div>
      </section>

      <ClientsMetrics
        newThisMonthCount={metrics.newThisMonthCount}
        totalCount={metrics.totalCount}
        unassignedCount={metrics.unassignedCount}
      />

      <ClientsFiltersBar
        onChangeOrigin={handleOriginChange}
        onChangeOwnership={handleOwnershipChange}
        onChangePeriod={handlePeriodChange}
        onChangeSearch={handleChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
        originValue={originValue}
        ownershipValue={ownershipValue}
        periodValue={periodValue}
        searchValue={searchValue}
      />

      {filteredClients.length === 0 ? (
        <ClientsEmptyState hasFilters={hasFilters} onReset={handleReset} />
      ) : (
        <ClientsTable
          clients={paginatedClients.items}
          currentPage={paginatedClients.currentPage}
          onExport={handleExport}
          onPageChange={handlePageChange}
          pageSize={10}
          totalItems={paginatedClients.totalItems}
          totalPages={paginatedClients.totalPages}
        />
      )}
    </div>
  );
}
