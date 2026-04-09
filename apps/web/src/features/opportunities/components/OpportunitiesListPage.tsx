'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PaginationControls } from '@/components/PaginationControls';
import { PageIntro } from '@/components/PageIntro';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { useTranslation } from '@/i18n/use-translation';
import { buildPageQueryString, getPageFromSearchParams, paginateItems } from '@/lib/pagination';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  buildOpportunityFilters,
  buildOpportunityFiltersQueryString,
  getOpportunityOwnerOptions,
  getOpportunitySortOptions,
  getOpportunityStageOptions,
  getOpportunityStatusOptions,
  getOpportunitySuccessMessage,
} from '../lib/opportunities-format';
import { useOpportunityOwnersQuery, useOpportunitiesQuery } from '../hooks/use-opportunities';
import { OpportunitiesEmptyState } from './OpportunitiesEmptyState';
import { OpportunitiesErrorState } from './OpportunitiesErrorState';
import { OpportunitiesFilters } from './OpportunitiesFilters';
import { OpportunitiesListSkeleton } from './OpportunitiesListSkeleton';
import { OpportunitiesTable } from './OpportunitiesTable';
import { OpportunitiesViewSwitch } from './OpportunitiesViewSwitch';

type OpportunityFiltersState = {
  ownerUserId: string;
  search: string;
  sortKey: string;
  stage: string;
  status: string;
};

function buildSortKey(sortBy?: string, order?: string) {
  return `${sortBy ?? 'createdAt'}:${order ?? 'desc'}`;
}

function parseSortKey(sortKey: string) {
  const [sortBy, order] = sortKey.split(':');

  return {
    order: order || 'desc',
    sortBy: sortBy || 'createdAt',
  };
}

export function OpportunitiesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => buildOpportunityFilters(searchParams), [searchParams]);
  const opportunitiesQuery = useOpportunitiesQuery(filters);
  const ownersQuery = useOpportunityOwnersQuery();
  const { messages } = useTranslation();
  const [filtersState, setFiltersState] = useState<OpportunityFiltersState>({
    ownerUserId: searchParams.get('ownerUserId') ?? '',
    search: searchParams.get('search') ?? '',
    sortKey: buildSortKey(searchParams.get('sortBy') ?? undefined, searchParams.get('order') ?? undefined),
    stage: searchParams.get('stage') ?? '',
    status: searchParams.get('status') ?? '',
  });

  useEffect(() => {
    setFiltersState({
      ownerUserId: searchParams.get('ownerUserId') ?? '',
      search: searchParams.get('search') ?? '',
      sortKey: buildSortKey(
        searchParams.get('sortBy') ?? undefined,
        searchParams.get('order') ?? undefined,
      ),
      stage: searchParams.get('stage') ?? '',
      status: searchParams.get('status') ?? '',
    });
  }, [searchParams]);

  const ownerOptions = ownersQuery.data ? getOpportunityOwnerOptions(ownersQuery.data, messages) : [];
  const showOwnerFilter = ownerOptions.length > 1;
  const hasFilters = Boolean(
    filters.search || filters.stage || filters.status || filters.ownerUserId,
  );
  const successMessage = getOpportunitySuccessMessage(searchParams.get('success'), messages);
  const currentPage = getPageFromSearchParams(searchParams);

  useQueryFeedbackToast(successMessage);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setFiltersState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSort = parseSortKey(filtersState.sortKey);
    const queryString = buildOpportunityFiltersQueryString({
      order: parsedSort.order,
      ownerUserId: filtersState.ownerUserId,
      search: filtersState.search,
      sortBy: parsedSort.sortBy,
      stage: filtersState.stage,
      status: filtersState.status,
    });

    router.replace(queryString ? `/opportunities?${queryString}` : '/opportunities');
  }

  function handleReset() {
    setFiltersState({
      ownerUserId: '',
      search: '',
      sortKey: 'createdAt:desc',
      stage: '',
      status: '',
    });
    router.replace('/opportunities');
  }

  function handlePageChange(page: number) {
    const queryString = buildPageQueryString(searchParams, page);

    router.replace(queryString ? `/opportunities?${queryString}` : '/opportunities');
  }

  if (opportunitiesQuery.isPending) {
    return <OpportunitiesListSkeleton />;
  }

  if (opportunitiesQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.opportunities.list.description}
          eyebrow={messages.opportunities.list.eyebrow}
          title={messages.opportunities.list.title}
        />
        <OpportunitiesErrorState
          message={getApiErrorMessage(
            opportunitiesQuery.error,
            messages.opportunities.list.errorFallback,
          )}
          onRetry={() => {
            void opportunitiesQuery.refetch();
          }}
        />
      </div>
    );
  }

  const paginatedOpportunities = paginateItems(
    opportunitiesQuery.data.opportunities,
    currentPage,
    10,
  );

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.opportunities.list.description}
        eyebrow={messages.opportunities.list.eyebrow}
        title={messages.opportunities.list.title}
      />

      <OpportunitiesViewSwitch view="list" />

      {ownersQuery.isError ? (
        <InlineBanner tone="info">
          {messages.opportunities.filters.ownerUnavailable}
        </InlineBanner>
      ) : null}

      <OpportunitiesFilters
        onChange={handleChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
        ownerOptions={ownerOptions}
        showOwnerFilter={showOwnerFilter}
        sortOptions={getOpportunitySortOptions(messages).map((option) => ({
          label: option.label,
          value: `${option.sortBy}:${option.order}`,
        }))}
        stageOptions={getOpportunityStageOptions(messages).map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        statusOptions={getOpportunityStatusOptions(messages).map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        values={filtersState}
      />

      {opportunitiesQuery.data.opportunities.length === 0 ? (
        <OpportunitiesEmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <OpportunitiesTable opportunities={paginatedOpportunities.items} />
          <PaginationControls
            currentPage={paginatedOpportunities.currentPage}
            itemLabel={messages.opportunities.list.itemLabel}
            onPageChange={handlePageChange}
            pageSize={10}
            totalItems={paginatedOpportunities.totalItems}
            totalPages={paginatedOpportunities.totalPages}
          />
        </>
      )}
    </div>
  );
}
