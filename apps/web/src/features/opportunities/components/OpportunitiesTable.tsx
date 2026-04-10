'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

import { formatOpportunityCurrency, formatOpportunityDate } from '../lib/opportunities-format';
import type { Opportunity } from '../types/opportunities';

import { OpportunityStageBadge } from './OpportunityStageBadge';
import { OpportunityStatusBadge } from './OpportunityStatusBadge';

type OpportunitiesTableProps = Readonly<{
  opportunities: Opportunity[];
}>;

export function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[1.4rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {locale === 'pt-BR' ? 'Diretorio de oportunidades' : 'Opportunity directory'}
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {locale === 'pt-BR'
              ? `${opportunities.length} registros na pagina atual`
              : `${opportunities.length} records on this page`}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead className="border-b border-[var(--border)] bg-[var(--card-dark)]">
            <tr className="text-xs uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.opportunity}</th>
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.stage}</th>
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.status}</th>
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.owner}</th>
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.value}</th>
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.closeDate}</th>
              <th className="px-6 py-4 font-semibold">{messages.opportunities.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr
                key={opportunity.id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[color:rgba(148,163,184,0.05)]"
              >
                <td className="px-6 py-5 align-top">
                  <div>
                    <Link
                      className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                      href={`/opportunities/${opportunity.id}`}
                    >
                      {opportunity.title}
                    </Link>
                    <div className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
                      <p>{opportunity.client.name}</p>
                      <p>{opportunity.client.company || messages.opportunities.table.noCompany}</p>
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
                    messages.opportunities.table.unassigned
                  )}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground)]">
                  {formatOpportunityCurrency(opportunity.estimatedValue, locale)}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {formatOpportunityDate(opportunity.expectedCloseDate, locale, messages)}
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/opportunities/${opportunity.id}`}
                    >
                      {messages.common.actions.view}
                    </Link>
                    <Link
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/opportunities/${opportunity.id}/edit`}
                    >
                      {messages.common.actions.edit}
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
