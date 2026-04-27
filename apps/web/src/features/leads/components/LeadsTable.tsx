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
    <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {locale === 'pt-BR' ? 'Diretorio de leads' : 'Lead directory'}
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {locale === 'pt-BR' ? `${leads.length} registros na pagina atual` : `${leads.length} records on this page`}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead className="border-b border-[var(--border)] bg-[var(--card-dark)]">
            <tr className="text-xs uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
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
                <tr
                  key={lead.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[color:rgba(148,163,184,0.05)]"
                >
                  <td className="px-6 py-5 align-top">
                    <div>
                      <Link
                        className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
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
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/leads/${lead.id}`}
                    >
                      {messages.common.actions.view}
                    </Link>
                      <Link
                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        href={`/leads/${lead.id}/edit`}
                    >
                      {messages.common.actions.edit}
                    </Link>
                      {canConvert ? (
                        <button
                          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[color:rgba(255,92,53,0.2)] bg-[var(--accent-soft)] px-3 text-sm font-semibold text-[var(--accent)] hover:bg-[color:rgba(255,92,53,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
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
                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[color:rgba(214,69,69,0.18)] bg-[color:rgba(214,69,69,0.06)] px-3 text-sm font-semibold text-[var(--danger)] hover:bg-[color:rgba(214,69,69,0.12)] disabled:cursor-not-allowed disabled:opacity-70"
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
