import Link from 'next/link';
import { getRequestI18n } from '@/i18n/request';

export default async function NotFoundPage() {
  const { messages } = await getRequestI18n();

  return (
    <main className="px-6 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {messages.errors.notFound.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
            {messages.errors.notFound.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">
            {messages.errors.notFound.description}
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/dashboard"
          >
            {messages.errors.notFound.cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
