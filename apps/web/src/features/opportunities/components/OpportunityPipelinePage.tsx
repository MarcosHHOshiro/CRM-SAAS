'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PageIntro } from '@/components/PageIntro';
import { useTranslation } from '@/i18n/use-translation';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  buildOpportunityFilters,
  buildOpportunityFiltersQueryString,
  getOpportunityOwnerOptions,
  getOpportunitySortOptions,
  getOpportunityStageOptions,
  getOpportunityStatusOptions,
} from '../lib/opportunities-format';
import {
  useOpportunityOwnersQuery,
  useOpportunityPipelineQuery,
} from '../hooks/use-opportunities';
import { OpportunitiesEmptyState } from './OpportunitiesEmptyState';
import { OpportunitiesErrorState } from './OpportunitiesErrorState';
import { OpportunitiesFilters } from './OpportunitiesFilters';
import { OpportunitiesListSkeleton } from './OpportunitiesListSkeleton';
import { OpportunitiesViewSwitch } from './OpportunitiesViewSwitch';
import { OpportunityKanbanBoard } from './OpportunityKanbanBoard';

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

export function OpportunityPipelinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => buildOpportunityFilters(searchParams), [searchParams]);
  const pipelineQuery = useOpportunityPipelineQuery(filters);
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
  const totalOpportunities =
    pipelineQuery.data?.groups.reduce(
      (count, group) => count + group.opportunities.length,
      0,
    ) ?? 0;
  const hasFilters = Boolean(
    filters.search || filters.stage || filters.status || filters.ownerUserId,
  );

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

    router.replace(queryString ? `/opportunities/pipeline?${queryString}` : '/opportunities/pipeline');
  }

  function handleReset() {
    setFiltersState({
      ownerUserId: '',
      search: '',
      sortKey: 'createdAt:desc',
      stage: '',
      status: '',
    });
    router.replace('/opportunities/pipeline');
  }

  if (pipelineQuery.isPending) {
    return <OpportunitiesListSkeleton />;
  }

  if (pipelineQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.opportunities.pipeline.description}
          eyebrow={messages.opportunities.pipeline.eyebrow}
          title={messages.opportunities.pipeline.title}
        />
        <OpportunitiesErrorState
          message={getApiErrorMessage(
            pipelineQuery.error,
            messages.opportunities.pipeline.errorFallback,
          )}
          onRetry={() => {
            void pipelineQuery.refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.opportunities.pipeline.description}
        eyebrow={messages.opportunities.pipeline.eyebrow}
        title={messages.opportunities.pipeline.title}
      />

      <OpportunitiesViewSwitch view="pipeline" />

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

      {totalOpportunities === 0 ? (
        <OpportunitiesEmptyState hasFilters={hasFilters} />
      ) : (
        <OpportunityKanbanBoard groups={pipelineQuery.data.groups} />
      )}
    </div>
  );
}
