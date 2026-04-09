type FeaturePlaceholderProps = Readonly<{
  description: string;
  highlights: string[];
  title: string;
}>;

export function FeaturePlaceholder({
  description,
  highlights,
  title,
}: FeaturePlaceholderProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Coming next</p>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
      </article>
      <aside className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
          Foundation ready
        </h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground)]">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
