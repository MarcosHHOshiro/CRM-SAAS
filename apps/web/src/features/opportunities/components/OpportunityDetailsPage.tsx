'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { SelectField } from '@/components/SelectField';
import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  getOpportunitySuccessMessage,
  opportunityFormStageOptions,
  opportunityStageLabels,
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
  const successMessage = getOpportunitySuccessMessage(searchParams.get('success'));

  useQueryFeedbackToast(successMessage);

  if (opportunityQuery.isPending) {
    return <OpportunityDetailsSkeleton />;
  }

  if (opportunityQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Review opportunity details, value, ownership, and move the deal through the pipeline."
          eyebrow="Opportunities"
          title="Opportunity details"
        />
        <OpportunitiesErrorState
          message={getApiErrorMessage(opportunityQuery.error, 'Unable to load this opportunity.')}
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
        message: getApiErrorMessage(error, 'Unable to update the opportunity stage right now.'),
        tone: 'error',
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Review opportunity details, value, ownership, and move the deal through the pipeline."
        eyebrow="Opportunities"
        title={opportunity.title}
      />
      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/opportunities"
        >
          Back to list
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/opportunities/pipeline"
        >
          Open pipeline
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href={`/opportunities/${opportunity.id}/edit`}
        >
          Edit opportunity
        </Link>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <SelectField
          label="Move stage"
          name="stage"
          onChange={handleStageChange}
          options={opportunityFormStageOptions.map((option) => ({
            label: opportunityStageLabels[option.value as keyof typeof opportunityStageLabels],
            value: option.value,
          }))}
          value={opportunity.stage}
        />
      </section>

      <OpportunityDetailsCard opportunity={opportunity} />
    </div>
  );
}
