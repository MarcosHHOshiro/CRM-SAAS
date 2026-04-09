'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

import { formatClientDate } from '../lib/clients-format';
import type { Client } from '../types/clients';

type ClientsTableProps = Readonly<{
  clients: Client[];
}>;

export function ClientsTable({ clients }: ClientsTableProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] text-left">
          <thead className="border-b border-[var(--border)] bg-white/65">
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">{messages.clients.table.client}</th>
              <th className="px-6 py-4 font-semibold">{messages.clients.table.owner}</th>
              <th className="px-6 py-4 font-semibold">{messages.clients.table.sourceLead}</th>
              <th className="px-6 py-4 font-semibold">{messages.clients.table.created}</th>
              <th className="px-6 py-4 font-semibold">{messages.clients.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-[var(--border)] last:border-b-0">
                <td className="px-6 py-5 align-top">
                  <div>
                    <Link
                      className="text-base font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}`}
                    >
                      {client.name}
                    </Link>
                    <div className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
                      <p>{client.email || messages.clients.table.noEmail}</p>
                      <p>{client.phone || messages.clients.table.noPhone}</p>
                      <p>{client.company || messages.clients.table.noCompany}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {client.owner ? (
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{client.owner.name}</p>
                      <p className="mt-1">{client.owner.email}</p>
                    </div>
                  ) : (
                    messages.clients.table.unassigned
                  )}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {client.sourceLead ? client.sourceLead.name : messages.clients.table.createdDirectly}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {formatClientDate(client.createdAt, locale)}
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}`}
                    >
                      {messages.common.actions.view}
                    </Link>
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}/edit`}
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
