'use client';

import Link from 'next/link';

import { formatClientDate } from '../lib/clients-format';
import type { Client } from '../types/clients';

type ClientsTableProps = Readonly<{
  clients: Client[];
}>;

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-[var(--border)] bg-white/65">
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Source lead</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
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
                      <p>{client.email || 'No email provided'}</p>
                      <p>{client.phone || 'No phone provided'}</p>
                      <p>{client.company || 'No company provided'}</p>
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
                    'Unassigned'
                  )}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {client.sourceLead ? client.sourceLead.name : 'Created directly'}
                </td>
                <td className="px-6 py-5 align-top text-sm text-[var(--foreground-muted)]">
                  {formatClientDate(client.createdAt)}
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}/edit`}
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
