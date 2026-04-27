import { EmptyStateIcon } from '@/components/EmptyStateIcon';
import { useTranslation } from '@/i18n/use-translation';

export function ActivitiesEmptyState() {
  const { messages } = useTranslation();

  return (
    <section className="rounded-lg border border-dashed border-[var(--border)] bg-[color:rgb(var(--card-dark-rgb)/0.6)] p-10 text-center shadow-[var(--shadow-soft)]">
      <EmptyStateIcon />
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{messages.activities.empty.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
        {messages.activities.empty.title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {messages.activities.empty.description}
      </p>
    </section>
  );
}
