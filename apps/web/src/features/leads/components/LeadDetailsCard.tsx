import { useTranslation } from '@/i18n/use-translation';

import { formatLeadDate, getLeadCanConvert } from '../lib/leads-format';
import type { Lead } from '../types/leads';

import { LeadStatusBadge } from './LeadStatusBadge';

type LeadDetailsCardProps = Readonly<{
  lead: Lead;
}>;

export function LeadDetailsCard({ lead }: LeadDetailsCardProps) {
  const { locale, messages } = useTranslation();
  const canConvert = getLeadCanConvert(lead);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.leads.details.profileEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{lead.name}</h2>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.leads.details.email}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lead.email || messages.leads.table.noEmail}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.leads.details.phone}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lead.phone || messages.leads.table.noPhone}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.leads.details.company}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lead.company || messages.leads.table.noCompany}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.leads.details.createdAt}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{formatLeadDate(lead.createdAt, locale, messages)}</p>
          </article>
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.leads.details.notes}</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {lead.notes || messages.leads.details.noNotes}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.leads.details.ownershipEyebrow}</p>
        {lead.owner ? (
          <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
            <p className="text-lg font-semibold text-[var(--foreground)]">{lead.owner.name}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{lead.owner.email}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{messages.roles[lead.owner.role]}</p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 p-5 text-sm text-[var(--foreground-muted)]">
            {messages.leads.details.unassigned}
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.leads.details.conversionEyebrow}</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {lead.clientId
              ? messages.leads.details.converted
              : canConvert
                ? messages.leads.details.canConvert
                : messages.leads.details.cannotConvert}
          </p>
        </div>
      </section>
    </div>
  );
}
