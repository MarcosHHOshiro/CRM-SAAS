import { EmptyStateIcon } from '@/components/EmptyStateIcon';
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
    <section className="rounded-lg border border-dashed border-[var(--border)] bg-[color:rgb(var(--card-dark-rgb)/0.6)] p-10 shadow-[var(--shadow-soft)]">
      <EmptyStateIcon />
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{messages.users.access.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{title ?? messages.users.access.title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
        {description ?? messages.users.access.description}
      </p>
    </section>
  );
}
