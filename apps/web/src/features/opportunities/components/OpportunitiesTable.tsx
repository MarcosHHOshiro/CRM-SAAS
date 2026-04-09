'use client';

import Link from 'next/link';

import { formatOpportunityCurrency, formatOpportunityDate } from '../lib/opportunities-format';
import type { Opportunity } from '../types/opportunities';

import { OpportunityStageBadge } from './OpportunityStageBadge';
import { OpportunityStatusBadge } from './OpportunityStatusBadge';

type OpportunitiesTableProps = Readonly<{
  opportunities: Opportunity[];
}>;

export function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-[var(--border)] bg-white/65">
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">Opportunity</th>
              <th className="px-6 py-4 font-semibold">Stage</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Value</th>
              <th className="px-6 py-4 font-semibold">Close date</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr
                key={opportunity.id}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <td className="px-6 py-5 align-top">
                  <div>
                    <Link
                      className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                      href={`/opportunities/${opportunity.id}`}
                    >
                      {opportunity.title}
                    </Link>
                    <div className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
                      <p>{opportunity.client.name}</p>
                      <p>{opportunity.client.company || 'No company provided'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  <OpportunityStageBadge stage={opportunity.stage} />
                </td>
                <td className="px-6 py-5 align-top">
                  <OpportunityStatusBadge status={opportunity.status} />
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {opportunity.owner ? (
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">
                        {opportunity.owner.name}
                      </p>
                      <p className="mt-1">{opportunity.owner.email}</p>
                    </div>
                  ) : (
                    'Unassigned'
                  )}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground)]">
                  {formatOpportunityCurrency(opportunity.estimatedValue)}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {formatOpportunityDate(opportunity.expectedCloseDate)}
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/opportunities/${opportunity.id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/opportunities/${opportunity.id}/edit`}
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
