type LoadingScreenProps = Readonly<{
  description?: string;
  title?: string;
}>;

export function LoadingScreen({
  description = 'Preparing your workspace and session details.',
  title = 'Loading your CRM',
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-8 py-10 text-center shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent-soft)] border-t-[var(--accent)]" />
        <h2 className="mt-6 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{description}</p>
      </div>
    </div>
  );
}
