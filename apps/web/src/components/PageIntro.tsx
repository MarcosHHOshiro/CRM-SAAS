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
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-6 py-7 shadow-[var(--shadow-soft)] backdrop-blur sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
        {description}
      </p>
    </section>
  );
}
