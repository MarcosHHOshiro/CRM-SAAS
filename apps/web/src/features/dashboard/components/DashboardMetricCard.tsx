type DashboardMetricCardProps = Readonly<{
  accent?: 'amber' | 'blue' | 'emerald' | 'red' | 'violet';
  description: string;
  featured?: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}>;

const accentClasses: Record<NonNullable<DashboardMetricCardProps['accent']>, string> = {
  amber: 'bg-[color:rgba(245,158,11,0.12)] text-amber-600 ring-[color:rgba(245,158,11,0.16)]',
  blue: 'bg-[color:rgba(37,99,235,0.11)] text-blue-600 ring-[color:rgba(37,99,235,0.15)]',
  emerald: 'bg-[color:rgba(16,185,129,0.12)] text-emerald-600 ring-[color:rgba(16,185,129,0.16)]',
  red: 'bg-[color:rgba(239,68,68,0.12)] text-red-600 ring-[color:rgba(239,68,68,0.16)]',
  violet: 'bg-[color:rgba(139,92,246,0.12)] text-violet-600 ring-[color:rgba(139,92,246,0.16)]',
};

export function DashboardMetricCard({
  accent = 'blue',
  description,
  featured = false,
  icon,
  label,
  value,
}: DashboardMetricCardProps) {
  return (
    <article
      className={`rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-[12rem] text-sm font-semibold leading-5 text-[var(--foreground)]">
          {label}
        </p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${accentClasses[accent]}`}
        >
          {icon}
        </span>
      </div>
      <h2
        className={`mt-7 font-semibold tracking-tight text-[var(--foreground)] ${
          featured ? 'text-4xl text-blue-600 sm:text-5xl' : 'text-3xl'
        }`}
      >
        {value}
      </h2>
      <p className="mt-2 text-sm leading-5 text-[var(--foreground-muted)]">{description}</p>
    </article>
  );
}
