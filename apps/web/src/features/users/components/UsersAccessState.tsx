import { useTranslation } from '@/i18n/use-translation';

type UsersAccessStateProps = Readonly<{
  description?: string;
  title?: string;
}>;

export function UsersAccessState({
  description,
  title,
}: UsersAccessStateProps) {
  const { messages } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.users.access.eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{title ?? messages.users.access.title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {description ?? messages.users.access.description}
      </p>
    </section>
  );
}
