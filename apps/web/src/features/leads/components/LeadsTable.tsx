'use client';

import Link from 'next/link';

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
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-[var(--border)] bg-white/65">
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">Lead</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
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
                        <p>{lead.email || 'No email provided'}</p>
                        <p>{lead.phone || 'No phone provided'}</p>
                        <p>{lead.company || 'No company provided'}</p>
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
                      'Unassigned'
                    )}
                  </td>
                  <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                    {formatLeadDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        href={`/leads/${lead.id}`}
                      >
                        View
                      </Link>
                      <Link
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        href={`/leads/${lead.id}/edit`}
                      >
                        Edit
                      </Link>
                      {canConvert ? (
                        <button
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={isMutatingConvertLeadId === lead.id}
                          onClick={() => onConvert(lead)}
                          type="button"
                        >
                          {isMutatingConvertLeadId === lead.id ? 'Converting...' : 'Convert'}
                        </button>
                      ) : null}
                      <button
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isDeletingLeadId === lead.id}
                        onClick={() => onDelete(lead)}
                        type="button"
                      >
                        {isDeletingLeadId === lead.id ? 'Deleting...' : 'Delete'}
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
