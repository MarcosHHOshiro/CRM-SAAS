type DashboardMetricCardProps = Readonly<{
  accent?: 'amber' | 'emerald' | 'red' | 'slate';
  description: string;
  label: string;
  value: string;
}>;

const accentClasses: Record<NonNullable<DashboardMetricCardProps['accent']>, string> = {
  amber: 'border-[color:rgba(217,119,6,0.18)] bg-[color:rgba(245,158,11,0.08)] text-amber-700',
  emerald: 'border-[color:rgba(255,92,53,0.22)] bg-[var(--accent-soft)] text-[var(--accent)]',
  red: 'border-[color:rgba(214,69,69,0.18)] bg-[color:rgba(214,69,69,0.06)] text-[var(--danger)]',
  slate: 'border-[var(--border)] bg-white text-[var(--foreground-muted)]',
};

export function DashboardMetricCard({
  accent = 'slate',
  description,
  label,
  value,
}: DashboardMetricCardProps) {
  return (
    <article className={`rounded-[1.35rem] border p-5 shadow-[var(--shadow-soft)] ${accentClasses[accent]}`}>
      <p className="text-sm font-medium text-[var(--foreground-muted)]">{label}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]">{value}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{description}</p>
    </article>
  );
}
