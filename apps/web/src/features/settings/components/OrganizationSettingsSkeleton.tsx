export function OrganizationSettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="h-4 w-32 rounded-full bg-slate-200" />
        <div className="mt-4 h-10 w-80 rounded-full bg-slate-300" />
        <div className="mt-4 h-5 max-w-3xl rounded-full bg-slate-100" />
      </section>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-4 w-28 rounded-full bg-slate-200" />
                <div className="h-12 rounded-2xl bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-11 w-44 rounded-full bg-slate-300" />
        </section>
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 w-20 rounded-full bg-slate-200" />
                <div className="mt-2 h-5 w-40 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
