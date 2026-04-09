'use client';

import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  formatOpportunityCurrency,
  opportunityFormStageOptions,
  opportunityStageLabels,
} from '../lib/opportunities-format';
import { useUpdateOpportunityStageMutation } from '../hooks/use-opportunities';
import type { Opportunity, OpportunityGroup } from '../types/opportunities';

import { OpportunityStageBadge } from './OpportunityStageBadge';
import { OpportunityStatusBadge } from './OpportunityStatusBadge';

type OpportunityKanbanBoardProps = Readonly<{
  groups: OpportunityGroup[];
}>;

type OpportunityKanbanCardProps = Readonly<{
  onStageUpdated: (message: { message: string; tone: 'error' | 'success' } | null) => void;
  opportunity: Opportunity;
}>;

function OpportunityKanbanCard({
  onStageUpdated,
  opportunity,
}: OpportunityKanbanCardProps) {
  const updateStageMutation = useUpdateOpportunityStageMutation();
  const [selectedStage, setSelectedStage] = useState(opportunity.stage);

  async function handleStageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStage = event.target.value;
    setSelectedStage(nextStage as typeof opportunity.stage);

    try {
      await updateStageMutation.mutateAsync({
        opportunityId: opportunity.id,
        stage: nextStage,
      });
      onStageUpdated({
        message: 'Opportunity stage updated successfully.',
        tone: 'success',
      });
    } catch (error) {
      setSelectedStage(opportunity.stage);
      onStageUpdated({
        message: getApiErrorMessage(error, 'Unable to update the opportunity stage right now.'),
        tone: 'error',
      });
    }
  }

  return (
    <article className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--card-strong)] p-4 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap gap-2">
        <OpportunityStageBadge stage={opportunity.stage} />
        <OpportunityStatusBadge status={opportunity.status} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{opportunity.title}</h3>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">{opportunity.client.name}</p>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {opportunity.client.company || 'No company provided'}
      </p>
      <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">
        {formatOpportunityCurrency(opportunity.estimatedValue)}
      </p>
      <div className="mt-4">
        <SelectField
          label="Move stage"
          name={`stage-${opportunity.id}`}
          onChange={handleStageChange}
          options={opportunityFormStageOptions.map((option) => ({
            label: opportunityStageLabels[option.value as keyof typeof opportunityStageLabels],
            value: option.value,
          }))}
          value={selectedStage}
        />
      </div>
      {updateStageMutation.isPending ? (
        <p className="mt-3 text-xs text-[var(--foreground-muted)]">Updating stage...</p>
      ) : null}
    </article>
  );
}

export function OpportunityKanbanBoard({ groups }: OpportunityKanbanBoardProps) {
  const [feedback, setFeedback] = useState<{ message: string; tone: 'error' | 'success' } | null>(
    null,
  );

  return (
    <div className="space-y-6">
      {feedback ? <InlineBanner tone={feedback.tone}>{feedback.message}</InlineBanner> : null}
      <section className="grid gap-4 xl:grid-cols-6">
        {groups.map((group) => (
          <section
            key={group.stage}
            className="flex min-h-[28rem] flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                {opportunityStageLabels[group.stage]}
              </h2>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--foreground-muted)]">
                {group.opportunities.length}
              </span>
            </div>
            <div className="mt-4 flex-1 space-y-4">
              {group.opportunities.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 p-4 text-sm text-[var(--foreground-muted)]">
                  No opportunities in this stage.
                </div>
              ) : (
                group.opportunities.map((opportunity) => (
                  <OpportunityKanbanCard
                    key={opportunity.id}
                    onStageUpdated={setFeedback}
                    opportunity={opportunity}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}
