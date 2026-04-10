'use client';

import { useTranslation } from '@/i18n/use-translation';

type ClientOriginBadgeProps = Readonly<{
  hasSourceLead: boolean;
}>;

export function ClientOriginBadge({ hasSourceLead }: ClientOriginBadgeProps) {
  const { locale, messages } = useTranslation();

  const label = hasSourceLead
    ? locale === 'pt-BR'
      ? 'Convertido de lead'
      : 'Converted from lead'
    : messages.clients.table.createdDirectly;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        hasSourceLead
          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'bg-slate-100 text-[var(--foreground-muted)]'
      }`}
    >
      {label}
    </span>
  );
}
