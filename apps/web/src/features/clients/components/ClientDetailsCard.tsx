'use client';

import { useTranslation } from '@/i18n/use-translation';

import { formatClientDate } from '../lib/clients-format';
import type { Client } from '../types/clients';

type ClientDetailsCardProps = Readonly<{
  client: Client;
}>;

export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  const { locale, messages } = useTranslation();
  const roleLabel = client.owner ? messages.roles[client.owner.role] : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.clients.details.profileEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{client.name}</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.clients.details.email}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{client.email || messages.clients.details.noEmail}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.clients.details.phone}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{client.phone || messages.clients.details.noPhone}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.clients.details.company}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{client.company || messages.clients.details.noCompany}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.clients.details.created}</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{formatClientDate(client.createdAt, locale)}</p>
          </article>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.clients.details.ownershipEyebrow}</p>
        {client.owner ? (
          <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
            <p className="text-lg font-semibold text-[var(--foreground)]">{client.owner.name}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{client.owner.email}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{roleLabel}</p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 p-5 text-sm text-[var(--foreground-muted)]">
            {messages.clients.details.unassigned}
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{messages.clients.details.sourceLead}</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {client.sourceLead
              ? `${client.sourceLead.name} (${client.sourceLead.status})`
              : messages.clients.details.createdDirectly}
          </p>
        </div>
      </section>
    </div>
  );
}
