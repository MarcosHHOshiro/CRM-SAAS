'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/use-translation';

import { formatClientDate } from '../lib/clients-format';
import type { Client } from '../types/clients';

type ClientsTableProps = Readonly<{
  clients: Client[];
  currentPage: number;
  onExport: () => void;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}>;

export function ClientsTable({
  clients,
  currentPage,
  onExport,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
}: ClientsTableProps) {
  const { locale, messages } = useTranslation();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {locale === 'pt-BR' ? 'Diretorio de clientes' : 'Client directory'}
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {locale === 'pt-BR'
              ? `${totalItems} registros encontrados`
              : `${totalItems} records found`}
          </p>
        </div>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          onClick={onExport}
          type="button"
        >
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          {locale === 'pt-BR' ? 'Exportar' : 'Export'}
        </button>
      </div>
      <div className="overflow-x-auto border-y border-[var(--border)]">
        <table className="w-full min-w-[1024px] text-left">
          <thead className="border-b border-[var(--border)] bg-[var(--card-dark)]">
            <tr className="text-xs font-medium text-[var(--foreground-muted)]">
              <th className="px-6 py-3">{messages.clients.table.client}</th>
              <th className="px-6 py-3">{locale === 'pt-BR' ? 'Empresa' : 'Company'}</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">{locale === 'pt-BR' ? 'Status' : 'Status'}</th>
              <th className="px-6 py-3">{messages.clients.table.created}</th>
              <th className="px-6 py-3">{messages.clients.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[color:rgba(148,163,184,0.06)]"
              >
                <td className="px-6 py-4 align-top">
                  <div className="space-y-1">
                    <Link
                      className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}`}
                    >
                      {client.name}
                    </Link>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {client.owner?.name ?? messages.clients.table.unassigned}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 align-top text-sm text-[var(--foreground)]">
                  {client.company || messages.clients.table.noCompany}
                </td>
                <td className="px-6 py-4 align-top text-sm text-[var(--foreground)]">
                  {client.email || messages.clients.table.noEmail}
                </td>
                <td className="px-6 py-4 align-top">
                  <span
                    className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold ${
                      client.owner
                        ? 'border-[color:rgba(22,163,74,0.32)] bg-[color:rgba(22,163,74,0.08)] text-[color:rgb(21,128,61)]'
                        : 'border-[color:rgba(217,119,6,0.3)] bg-[color:rgba(245,158,11,0.12)] text-[color:rgb(146,64,14)]'
                    }`}
                  >
                    {client.owner
                      ? locale === 'pt-BR'
                        ? 'Ativo'
                        : 'Active'
                      : locale === 'pt-BR'
                        ? 'Pendente'
                        : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 align-top text-sm text-[var(--foreground-muted)]">
                  {formatClientDate(client.createdAt, locale)}
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex min-h-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      href={`/clients/${client.id}`}
                    >
                      {messages.common.actions.view}
                    </Link>
                    <Link
                      className="inline-flex min-h-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card-dark)] px-3 text-xs font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
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

      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-[var(--foreground-muted)]">
          {locale === 'pt-BR'
            ? `Mostrando ${startItem}-${endItem} de ${totalItems} registros`
            : `Showing ${startItem}-${endItem} of ${totalItems} records`}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex min-h-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            type="button"
          >
            {messages.common.actions.previous}
          </button>
          <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card-dark)] px-2 text-xs font-semibold text-[var(--foreground)]">
            {currentPage}
          </span>
          <button
            className="inline-flex min-h-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            type="button"
          >
            {messages.common.actions.next}
          </button>
        </div>
      </div>
    </section>
  );
}
