'use client';

import { useState } from 'react';

import { SelectField } from '@/components/SelectField';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/i18n/use-translation';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  formatOpportunityCurrency,
  getOpportunityFormStageOptions,
  getOpportunityStageLabels,
} from '../lib/opportunities-format';
import { useUpdateOpportunityStageMutation } from '../hooks/use-opportunities';
import type { Opportunity, OpportunityGroup } from '../types/opportunities';

import { OpportunityStageBadge } from './OpportunityStageBadge';
import { OpportunityStatusBadge } from './OpportunityStatusBadge';

type OpportunityKanbanBoardProps = Readonly<{
  groups: OpportunityGroup[];
}>;

type OpportunityKanbanCardProps = Readonly<{
  opportunity: Opportunity;
}>;

function OpportunityKanbanCard({ opportunity }: OpportunityKanbanCardProps) {
  const updateStageMutation = useUpdateOpportunityStageMutation();
  const [selectedStage, setSelectedStage] = useState(opportunity.stage);
  const { showToast } = useToast();
  const { locale, messages } = useTranslation();

  async function handleStageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStage = event.target.value;
    setSelectedStage(nextStage as typeof opportunity.stage);

    try {
      await updateStageMutation.mutateAsync({
        opportunityId: opportunity.id,
        stage: nextStage,
      });
      showToast({
        message: messages.opportunities.shared.successStageUpdated,
        tone: 'success',
      });
    } catch (error) {
      setSelectedStage(opportunity.stage);
      showToast({
        message: getApiErrorMessage(error, messages.opportunities.shared.stageUpdateError),
        tone: 'error',
      });
    }
  }

  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--card-strong)] p-4 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap gap-2">
        <OpportunityStageBadge stage={opportunity.stage} />
        <OpportunityStatusBadge status={opportunity.status} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{opportunity.title}</h3>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">{opportunity.client.name}</p>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {opportunity.client.company || messages.opportunities.table.noCompany}
      </p>
      <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">
        {formatOpportunityCurrency(opportunity.estimatedValue, locale)}
      </p>
      <div className="mt-4">
        <SelectField
          label={messages.opportunities.details.moveStage}
          name={`stage-${opportunity.id}`}
          onChange={handleStageChange}
          options={getOpportunityFormStageOptions(messages).map((option) => ({
            label: getOpportunityStageLabels(messages)[option.value as keyof ReturnType<typeof getOpportunityStageLabels>],
            value: option.value,
          }))}
          value={selectedStage}
        />
      </div>
      {updateStageMutation.isPending ? (
        <p className="mt-3 text-xs text-[var(--foreground-muted)]">{messages.opportunities.shared.stageUpdating}</p>
      ) : null}
    </article>
  );
}

export function OpportunityKanbanBoard({ groups }: OpportunityKanbanBoardProps) {
  const { messages } = useTranslation();
  const stageLabels = getOpportunityStageLabels(messages);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-6">
        {groups.map((group) => (
          <section
            key={group.stage}
            className="flex min-h-[28rem] flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                {stageLabels[group.stage]}
              </h2>
              <span className="rounded-full bg-[var(--card-strong)] px-3 py-1 text-xs font-semibold text-[var(--foreground-muted)]">
                {group.opportunities.length}
              </span>
            </div>
            <div className="mt-4 flex-1 space-y-4">
              {group.opportunities.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[var(--border)] bg-[color:rgb(var(--card-dark-rgb)/0.6)] p-4 text-sm text-[var(--foreground-muted)]">
                  {messages.opportunities.empty.emptyStage}
                </div>
              ) : (
                group.opportunities.map((opportunity) => (
                  <OpportunityKanbanCard key={opportunity.id} opportunity={opportunity} />
                ))
              )}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}
