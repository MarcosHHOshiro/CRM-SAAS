'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { PaginationControls } from '@/components/PaginationControls';
import { PageIntro } from '@/components/PageIntro';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { buildPageQueryString, getPageFromSearchParams, paginateItems } from '@/lib/pagination';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  buildClientFilters,
  buildClientFiltersQueryString,
  getClientSuccessMessage,
} from '../lib/clients-format';
import { useClientsQuery } from '../hooks/use-clients';
import { ClientsEmptyState } from './ClientsEmptyState';
import { ClientsErrorState } from './ClientsErrorState';
import { ClientsListSkeleton } from './ClientsListSkeleton';
import { ClientsSearch } from './ClientsSearch';
import { ClientsTable } from './ClientsTable';

export function ClientsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => buildClientFilters(searchParams), [searchParams]);
  const clientsQuery = useClientsQuery(filters);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    setSearchValue(searchParams.get('search') ?? '');
  }, [searchParams]);

  const successMessage = getClientSuccessMessage(searchParams.get('success'));
  const hasFilters = Boolean(filters.search);
  const currentPage = getPageFromSearchParams(searchParams);

  useQueryFeedbackToast(successMessage);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const queryString = buildClientFiltersQueryString({ search: searchValue });

    router.replace(queryString ? `/clients?${queryString}` : '/clients');
  }

  function handleReset() {
    setSearchValue('');
    router.replace('/clients');
  }

  function handlePageChange(page: number) {
    const queryString = buildPageQueryString(searchParams, page);

    router.replace(queryString ? `/clients?${queryString}` : '/clients');
  }

  if (clientsQuery.isPending) {
    return <ClientsListSkeleton />;
  }

  if (clientsQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Keep a clean customer directory with the latest client records from the current organization."
          eyebrow="Clients"
          title="Client management"
        />
        <ClientsErrorState
          message={getApiErrorMessage(clientsQuery.error, 'Please try loading the clients again.')}
          onRetry={() => {
            void clientsQuery.refetch();
          }}
        />
      </div>
    );
  }

  const paginatedClients = paginateItems(clientsQuery.data.clients, currentPage, 10);

  return (
    <div className="space-y-6">
      <PageIntro
        description="Keep a clean customer directory with the latest client records from the current organization."
        eyebrow="Clients"
        title="Client management"
      />

      <ClientsSearch
        onChange={handleChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
        value={searchValue}
      />

      {clientsQuery.data.clients.length === 0 ? (
        <ClientsEmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <ClientsTable clients={paginatedClients.items} />
          <PaginationControls
            currentPage={paginatedClients.currentPage}
            itemLabel="clients"
            onPageChange={handlePageChange}
            pageSize={10}
            totalItems={paginatedClients.totalItems}
            totalPages={paginatedClients.totalPages}
          />
        </>
      )}
    </div>
  );
}
