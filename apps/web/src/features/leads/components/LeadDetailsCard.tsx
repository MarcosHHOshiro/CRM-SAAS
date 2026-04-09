import { formatUserRole } from '@/lib/format';

import { formatLeadDate, getLeadCanConvert } from '../lib/leads-format';
import type { Lead } from '../types/leads';

import { LeadStatusBadge } from './LeadStatusBadge';

type LeadDetailsCardProps = Readonly<{
  lead: Lead;
}>;

export function LeadDetailsCard({ lead }: LeadDetailsCardProps) {
  const canConvert = getLeadCanConvert(lead);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Lead profile</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{lead.name}</h2>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Email</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lead.email || 'No email provided'}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Phone</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lead.phone || 'No phone provided'}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Company</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lead.company || 'No company provided'}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Created</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{formatLeadDate(lead.createdAt)}</p>
          </article>
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Notes</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {lead.notes || 'No notes added yet.'}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Lead ownership</p>
        {lead.owner ? (
          <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
            <p className="text-lg font-semibold text-[var(--foreground)]">{lead.owner.name}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{lead.owner.email}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{formatUserRole(lead.owner.role)}</p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 p-5 text-sm text-[var(--foreground-muted)]">
            This lead is currently unassigned.
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Conversion</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {lead.clientId
              ? 'This lead has already been converted into a client record.'
              : canConvert
                ? 'This lead is eligible for conversion into a client.'
                : 'This lead cannot be converted right now.'}
          </p>
        </div>
      </section>
    </div>
  );
}
