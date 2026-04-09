'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

import { formatLeadDate, getLeadCanConvert } from '../lib/leads-format';
import type { Lead } from '../types/leads';

import { LeadStatusBadge } from './LeadStatusBadge';

type LeadsTableProps = Readonly<{
  isDeletingLeadId?: string | null;
  isMutatingConvertLeadId?: string | null;
  leads: Lead[];
  onConvert: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}>;

export function LeadsTable({
  isDeletingLeadId,
  isMutatingConvertLeadId,
  leads,
  onConvert,
  onDelete,
}: LeadsTableProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-[920px] text-left">
          <thead className="border-b border-[var(--border)] bg-white/65">
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">{messages.leads.table.lead}</th>
              <th className="px-6 py-4 font-semibold">{messages.leads.table.status}</th>
              <th className="px-6 py-4 font-semibold">{messages.leads.table.owner}</th>
              <th className="px-6 py-4 font-semibold">{messages.leads.table.createdAt}</th>
              <th className="px-6 py-4 font-semibold">{messages.leads.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const canConvert = getLeadCanConvert(lead);

              return (
                <tr key={lead.id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="px-6 py-5 align-top">
                    <div>
                      <Link
                        className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                        href={`/leads/${lead.id}`}
                      >
                        {lead.name}
                      </Link>
                      <div className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
                        <p>{lead.email || messages.leads.table.noEmail}</p>
                        <p>{lead.phone || messages.leads.table.noPhone}</p>
                        <p>{lead.company || messages.leads.table.noCompany}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                    {lead.owner ? (
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{lead.owner.name}</p>
                        <p className="mt-1">{lead.owner.email}</p>
                      </div>
                    ) : (
                      messages.leads.table.unassigned
                    )}
                  </td>
                  <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                    {formatLeadDate(lead.createdAt, locale, messages)}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        href={`/leads/${lead.id}`}
                    >
                      {messages.common.actions.view}
                    </Link>
                      <Link
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        href={`/leads/${lead.id}/edit`}
                    >
                      {messages.common.actions.edit}
                    </Link>
                      {canConvert ? (
                        <button
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={isMutatingConvertLeadId === lead.id}
                          onClick={() => onConvert(lead)}
                          type="button"
                        >
                          {isMutatingConvertLeadId === lead.id
                            ? messages.leads.table.converting
                            : messages.leads.table.convert}
                        </button>
                      ) : null}
                      <button
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isDeletingLeadId === lead.id}
                        onClick={() => onDelete(lead)}
                        type="button"
                      >
                        {isDeletingLeadId === lead.id
                          ? messages.leads.table.deleting
                          : messages.leads.table.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
