import { ThemeToggle } from '@/components/ThemeToggle';
import { getRequestI18n } from '@/i18n/request';

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

function InfoCardIcon({ kind }: { kind: 'modules' | 'security' }) {
  if (kind === 'modules') {
    return (
      <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
        <rect height="6.5" rx="1.5" width="6.5" x="3.75" y="4.25" stroke="currentColor" strokeWidth="1.7" />
        <rect height="6.5" rx="1.5" width="9.25" x="11" y="4.25" stroke="currentColor" strokeWidth="1.7" />
        <rect height="8.75" rx="1.5" width="9.25" x="11" y="11" stroke="currentColor" strokeWidth="1.7" />
        <rect height="8.75" rx="1.5" width="6.5" x="3.75" y="11" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3.75 18.5 6v5.1c0 4.2-2.6 7.7-6.5 9.15-3.9-1.45-6.5-4.95-6.5-9.15V6L12 3.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m9.4 12.25 1.75 1.75 3.5-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { messages } = await getRequestI18n();
  const stats = messages.auth.layout.stats;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--background-strong)_0%,var(--background)_56%,var(--background-end)_100%)] px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]">
              <span className="h-4 w-4 rounded-md bg-[var(--accent)]" />
            </span>
            <div>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                {messages.shell.workspaceEyebrow}
              </p>
              <p className="text-sm font-semibold text-[var(--foreground)]">{messages.common.brand}</p>
            </div>
          </div>
          <ThemeToggle showLabels={false} />
        </header>

        <div className="grid min-h-[calc(100vh-8.5rem)] gap-14 py-10 lg:grid-cols-[minmax(0,1.08fr)_27.5rem] lg:items-center lg:gap-20">
          <section className="max-w-[44rem]">
            <p className="inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              {messages.auth.layout.eyebrow}
            </p>

            <h1 className="mt-8 text-4xl font-semibold tracking-[-0.035em] text-[var(--foreground)] sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
              {messages.auth.layout.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[1.02rem] leading-8 text-[var(--foreground-muted)]">
              {messages.auth.layout.description}
            </p>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-dark)] text-[var(--foreground-muted)]">
                  <InfoCardIcon kind="modules" />
                </div>
                <p className="mt-5 text-base font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  {stats[0].value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{stats[0].label}</p>
              </article>

              <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-dark)] text-[var(--foreground-muted)]">
                  <InfoCardIcon kind="security" />
                </div>
                <p className="mt-5 text-base font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  {stats[1].value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{stats[1].label}</p>
              </article>
            </div>
          </section>

          <section className="flex justify-start lg:justify-end">
            <div className="w-full max-w-[27.5rem]">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
