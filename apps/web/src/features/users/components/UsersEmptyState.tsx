import Link from 'next/link';

export function UsersEmptyState() {
  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Users</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        No team members created yet.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        Create your first internal user to start delegating work across owners, managers, and sales reps.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
        href="/users/new"
      >
        Create first user
      </Link>
    </section>
  );
}
