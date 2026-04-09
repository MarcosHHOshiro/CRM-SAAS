import { formatUserRole } from '@/lib/format';

import { formatClientDate } from '../lib/clients-format';
import type { Client } from '../types/clients';

type ClientDetailsCardProps = Readonly<{
  client: Client;
}>;

export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Client profile</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{client.name}</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Email</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{client.email || 'No email provided'}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Phone</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{client.phone || 'No phone provided'}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Company</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{client.company || 'No company provided'}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Created</p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{formatClientDate(client.createdAt)}</p>
          </article>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Ownership and origin</p>
        {client.owner ? (
          <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
            <p className="text-lg font-semibold text-[var(--foreground)]">{client.owner.name}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{client.owner.email}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">{formatUserRole(client.owner.role)}</p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/55 p-5 text-sm text-[var(--foreground-muted)]">
            This client is currently unassigned.
          </div>
        )}

        <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Source lead</p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {client.sourceLead
              ? `${client.sourceLead.name} (${client.sourceLead.status})`
              : 'This client was created directly, without a linked lead conversion.'}
          </p>
        </div>
      </section>
    </div>
  );
}
