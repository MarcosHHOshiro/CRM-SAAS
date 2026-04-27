import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

type OpportunitiesViewSwitchProps = Readonly<{
  view: 'list' | 'pipeline';
}>;

export function OpportunitiesViewSwitch({ view }: OpportunitiesViewSwitchProps) {
  const { messages } = useTranslation();

  const items = [
    { href: '/opportunities', label: messages.opportunities.viewSwitch.list, value: 'list' },
    { href: '/opportunities/pipeline', label: messages.opportunities.viewSwitch.pipeline, value: 'pipeline' },
  ] as const;

  return (
    <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 shadow-[var(--shadow-soft)]">
      {items.map((item) => {
        const active = item.value === view;

        return (
          <Link
            key={item.href}
            className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold ${
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
