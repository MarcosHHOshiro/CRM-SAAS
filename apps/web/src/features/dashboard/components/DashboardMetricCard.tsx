type DashboardMetricCardProps = Readonly<{
  accent?: 'amber' | 'emerald' | 'red' | 'slate';
  description: string;
  label: string;
  value: string;
}>;

const accentClasses: Record<NonNullable<DashboardMetricCardProps['accent']>, string> = {
  amber: 'bg-amber-100 text-amber-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  red: 'bg-rose-100 text-rose-800',
  slate: 'bg-slate-200 text-slate-700',
};

export function DashboardMetricCard({
  accent = 'slate',
  description,
  label,
  value,
}: DashboardMetricCardProps) {
  return (
    <article className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
            {label}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {value}
          </h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${accentClasses[accent]}`}>
          {label}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{description}</p>
    </article>
  );
}
