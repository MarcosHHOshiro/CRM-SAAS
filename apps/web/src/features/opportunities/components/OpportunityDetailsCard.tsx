import { formatUserRole } from '@/lib/format';

import {
  formatOpportunityCurrency,
  formatOpportunityDate,
} from '../lib/opportunities-format';
import type { Opportunity } from '../types/opportunities';

import { OpportunityStageBadge } from './OpportunityStageBadge';
import { OpportunityStatusBadge } from './OpportunityStatusBadge';

type OpportunityDetailsCardProps = Readonly<{
  opportunity: Opportunity;
}>;

export function OpportunityDetailsCard({
  opportunity,
}: OpportunityDetailsCardProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Opportunity profile
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {opportunity.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <OpportunityStageBadge stage={opportunity.stage} />
            <OpportunityStatusBadge status={opportunity.status} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Client</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{opportunity.client.name}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Estimated value</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">
              {formatOpportunityCurrency(opportunity.estimatedValue)}
            </p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Expected close</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">
              {formatOpportunityDate(opportunity.expectedCloseDate)}
            </p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Created</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">
              {formatOpportunityDate(opportunity.createdAt)}
            </p>
          </article>
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Notes</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {opportunity.notes || 'No notes added yet.'}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Ownership and account context
        </p>
        {opportunity.owner ? (
          <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {opportunity.owner.name}
            </p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              {opportunity.owner.email}
            </p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              {formatUserRole(opportunity.owner.role)}
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 p-5 text-sm text-[var(--foreground-muted)]">
            This opportunity is currently unassigned.
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Client account</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {opportunity.client.company
              ? `${opportunity.client.name} - ${opportunity.client.company}`
              : opportunity.client.name}
          </p>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {opportunity.client.email || 'No client email provided'}
          </p>
        </div>
      </section>
    </div>
  );
}
