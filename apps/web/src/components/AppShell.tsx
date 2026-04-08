type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-3xl border bg-[var(--card)] px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">CRM SaaS</p>
            <h1 className="text-xl font-semibold text-white">Multi-tenant workspace</h1>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            Initial setup
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

