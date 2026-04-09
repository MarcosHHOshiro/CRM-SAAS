import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <div className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">404</p>
          <h1 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">This page does not exist.</h1>
          <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">
            The route may have moved or the session may have redirected elsewhere.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            href="/dashboard"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
