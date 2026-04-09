type AuthCardProps = Readonly<{
  children: React.ReactNode;
  description: string;
  title: string;
}>;

export function AuthCard({ children, description, title }: AuthCardProps) {
  return (
    <div className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">Pulse CRM</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[2.2rem]">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
