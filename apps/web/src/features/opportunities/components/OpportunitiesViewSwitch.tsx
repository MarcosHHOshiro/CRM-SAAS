import Link from 'next/link';

type OpportunitiesViewSwitchProps = Readonly<{
  view: 'list' | 'pipeline';
}>;

export function OpportunitiesViewSwitch({ view }: OpportunitiesViewSwitchProps) {
  const items = [
    { href: '/opportunities', label: 'List', value: 'list' },
    { href: '/opportunities/pipeline', label: 'Pipeline', value: 'pipeline' },
  ] as const;

  return (
    <div className="inline-flex rounded-full border border-[var(--border)] bg-white/75 p-1 shadow-[var(--shadow-soft)]">
      {items.map((item) => {
        const active = item.value === view;

        return (
          <Link
            key={item.href}
            className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold ${
              active
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--foreground)] hover:text-[var(--accent)]'
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
