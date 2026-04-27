type PageIntroProps = Readonly<{
  description: string;
  eyebrow?: string;
  title: string;
}>;

export function PageIntro({
  description,
  eyebrow = 'Workspace',
  title,
}: PageIntroProps) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-6 shadow-[var(--shadow-soft)] sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
        Workspace / {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
        {description}
      </p>
    </section>
  );
}
