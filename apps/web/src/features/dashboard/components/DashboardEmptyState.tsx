'use client';

import { useTranslation } from '@/i18n/use-translation';

export function DashboardEmptyState() {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.dashboard.empty.eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {messages.dashboard.empty.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)] mx-auto">
        {messages.dashboard.empty.description}
      </p>
    </section>
  );
}
