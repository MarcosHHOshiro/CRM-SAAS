'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { SelectField } from '@/components/SelectField';
import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { useTranslation } from '@/i18n/use-translation';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  getOpportunityFormStageOptions,
  getOpportunityStageLabels,
  getOpportunitySuccessMessage,
} from '../lib/opportunities-format';
import {
  useOpportunityQuery,
  useUpdateOpportunityStageMutation,
} from '../hooks/use-opportunities';
import { OpportunityDetailsCard } from './OpportunityDetailsCard';
import { OpportunityDetailsSkeleton } from './OpportunityDetailsSkeleton';
import { OpportunitiesErrorState } from './OpportunitiesErrorState';

export function OpportunityDetailsPage() {
  const params = useParams<{ opportunityId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = params.opportunityId;
  const opportunityQuery = useOpportunityQuery(opportunityId);
  const updateStageMutation = useUpdateOpportunityStageMutation();
  const { showToast } = useToast();
  const { messages } = useTranslation();
  const successMessage = getOpportunitySuccessMessage(searchParams.get('success'), messages);

  useQueryFeedbackToast(successMessage);

  if (opportunityQuery.isPending) {
    return <OpportunityDetailsSkeleton />;
  }

  if (opportunityQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.opportunities.details.description}
          eyebrow={messages.opportunities.details.eyebrow}
          title={messages.opportunities.details.title}
        />
        <OpportunitiesErrorState
          message={getApiErrorMessage(opportunityQuery.error, messages.opportunities.details.loadError)}
        />
      </div>
    );
  }
  const opportunity = opportunityQuery.data.opportunity;

  async function handleStageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const stage = event.target.value;

    try {
      await updateStageMutation.mutateAsync({
        opportunityId: opportunity.id,
        stage,
      });
      router.replace(`/opportunities/${opportunity.id}?success=stageUpdated`);
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error, messages.opportunities.shared.stageUpdateError),
        tone: 'error',
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.opportunities.details.description}
        eyebrow={messages.opportunities.details.eyebrow}
        title={opportunity.title}
      />
      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/opportunities"
        >
          {messages.common.actions.backToList}
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/opportunities/pipeline"
        >
          {messages.opportunities.details.openPipeline}
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href={`/opportunities/${opportunity.id}/edit`}
        >
          {messages.opportunities.details.editButton}
        </Link>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <SelectField
          label={messages.opportunities.details.moveStage}
          name="stage"
          onChange={handleStageChange}
          options={getOpportunityFormStageOptions(messages).map((option) => ({
            label: getOpportunityStageLabels(messages)[option.value as keyof ReturnType<typeof getOpportunityStageLabels>],
            value: option.value,
          }))}
          value={opportunity.stage}
        />
      </section>

      <OpportunityDetailsCard opportunity={opportunity} />
    </div>
  );
}
