import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

export function UsersEmptyState() {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.users.empty.eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        {messages.users.empty.title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {messages.users.empty.description}
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
        href="/users/new"
      >
        {messages.users.empty.createButton}
      </Link>
    </section>
  );
}
