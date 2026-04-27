'use client';

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
          <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Something failed
            </p>
            <h1 className="mt-4 text-3xl font-semibold">The workspace could not be rendered.</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">
              {error.message || 'Please try again. If the issue persists, check the API server and environment configuration.'}
            </p>
            <button
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
              onClick={reset}
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
