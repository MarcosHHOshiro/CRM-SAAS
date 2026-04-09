export function ActivitiesEmptyState() {
  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Activities</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        No activities found for the current filters.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        Create a new activity or broaden the filters to see notes, calls, emails, meetings, and tasks.
      </p>
    </section>
  );
}
