'use client';

import { useTranslation } from '@/i18n/use-translation';

type ClientsMetricsProps = Readonly<{
  newThisMonthCount: number;
  totalCount: number;
  unassignedCount: number;
}>;

type MetricCardProps = Readonly<{
  accent?: 'amber' | 'blue' | 'emerald';
  helper: string;
  icon: React.ReactNode;
  label: string;
  value: number;
}>;

function MetricCard({ accent = 'blue', helper, icon, label, value }: MetricCardProps) {
  const iconClassName = {
    amber: 'bg-[color:rgba(245,158,11,0.12)] text-amber-600 ring-[color:rgba(245,158,11,0.16)]',
    blue: 'bg-[color:rgba(37,99,235,0.11)] text-blue-600 ring-[color:rgba(37,99,235,0.15)]',
    emerald: 'bg-[color:rgba(16,185,129,0.12)] text-emerald-600 ring-[color:rgba(16,185,129,0.16)]',
  }[accent];
  const chipClassName = {
    amber: 'border-[color:rgba(245,158,11,0.2)] bg-[color:rgba(245,158,11,0.1)] text-amber-700',
    blue: 'border-[color:rgba(37,99,235,0.18)] bg-[color:rgba(37,99,235,0.08)] text-blue-700',
    emerald: 'border-[color:rgba(16,185,129,0.18)] bg-[color:rgba(16,185,129,0.1)] text-emerald-700',
  }[accent];

  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${iconClassName}`}>
          {icon}
        </span>
      </div>
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
        accent="emerald"
        helper={`+${activeSharePercent}%`}
        icon={<ClientMetricIcon type="users" />}
        label={locale === 'pt-BR' ? 'Clientes ativos' : 'Active clients'}
        value={totalCount}
      />
      <MetricCard
        accent="blue"
        helper={`+${newThisMonthCount}`}
        icon={<ClientMetricIcon type="plus" />}
        label={locale === 'pt-BR' ? 'Novos este mes' : 'New this month'}
        value={newThisMonthCount}
      />
      <MetricCard
        accent="amber"
        helper={pendingLabel}
        icon={<ClientMetricIcon type="clock" />}
        label={locale === 'pt-BR' ? 'Sem responsavel' : 'Unassigned'}
        value={unassignedCount}
      />
    </section>
  );
}

function ClientMetricIcon({ type }: Readonly<{ type: 'clock' | 'plus' | 'users' }>) {
  if (type === 'clock') {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4.2l2.8 1.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === 'plus') {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M16 18v-1.2a3.8 3.8 0 0 0-3.8-3.8H7.8A3.8 3.8 0 0 0 4 16.8V18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <circle cx="10" cy="7.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 9v5M15.5 11.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M16 18v-1a3.7 3.7 0 0 0-3.7-3.7H8A3.7 3.7 0 0 0 4.3 17v1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="10.2" cy="7.6" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16.4 11.4 1.7 1.7 3-3.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
