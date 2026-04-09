type UsersAccessStateProps = Readonly<{
  description?: string;
  title?: string;
}>;

export function UsersAccessState({
  description = 'Only owners and managers can manage organization users. Sales reps can still access the private workspace, but not this admin area.',
  title = 'Team administration is restricted.',
}: UsersAccessStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Users</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
    </section>
  );
}
