'use client';

import { useTranslation } from '@/i18n/use-translation';

type ClientsMetricsProps = Readonly<{
  newThisMonthCount: number;
  totalCount: number;
  unassignedCount: number;
}>;

type MetricCardProps = Readonly<{
  accent?: 'brand' | 'neutral' | 'warning';
  helper: string;
  label: string;
  value: number;
}>;

function MetricCard({ accent = 'neutral', helper, label, value }: MetricCardProps) {
  const accentClassName = {
    brand: 'border-[color:rgba(255,92,53,0.2)] bg-[color:rgba(255,92,53,0.06)]',
    neutral: 'border-[var(--border)] bg-[color:rgba(255,255,255,0.88)]',
    warning: 'border-[color:rgba(217,119,6,0.22)] bg-[color:rgba(245,158,11,0.08)]',
  }[accent];
  const chipClassName = {
    brand: 'border-[color:rgba(255,92,53,0.32)] bg-[var(--accent)] text-white',
    neutral: 'border-[var(--border)] bg-[var(--card-dark)] text-[var(--foreground-muted)]',
    warning: 'border-[color:rgba(217,119,6,0.3)] bg-[color:rgba(245,158,11,0.16)] text-[color:rgb(146,64,14)]',
  }[accent];

  return (
    <article className={`rounded-xl border px-5 py-4 ${accentClassName}`}>
      <p className="text-sm text-[var(--foreground)]">{label}</p>
      <p className="mt-5 text-4xl font-semibold leading-none tracking-tight text-[var(--foreground)]">
        {value}
      </p>
      <span
        className={`mt-3 inline-flex min-h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold ${chipClassName}`}
      >
        {helper}
      </span>
    </article>
  );
}

export function ClientsMetrics({
  newThisMonthCount,
  totalCount,
  unassignedCount,
}: ClientsMetricsProps) {
  const { locale } = useTranslation();
  const activeSharePercent =
    totalCount === 0 ? 0 : Math.round(((totalCount - unassignedCount) / totalCount) * 100);
  const pendingLabel =
    locale === 'pt-BR'
      ? `${unassignedCount} pendente${unassignedCount === 1 ? '' : 's'}`
      : `${unassignedCount} pending`;

  return (
    <section className="grid gap-3 lg:grid-cols-3">
      <MetricCard
        accent="brand"
        helper={`+${activeSharePercent}%`}
        label={locale === 'pt-BR' ? 'Clientes ativos' : 'Active clients'}
        value={totalCount}
      />
      <MetricCard
        helper={`+${newThisMonthCount}`}
        label={locale === 'pt-BR' ? 'Novos este mes' : 'New this month'}
        value={newThisMonthCount}
      />
      <MetricCard
        accent="warning"
        helper={pendingLabel}
        label={locale === 'pt-BR' ? 'Sem responsavel' : 'Unassigned'}
        value={unassignedCount}
      />
    </section>
  );
}
