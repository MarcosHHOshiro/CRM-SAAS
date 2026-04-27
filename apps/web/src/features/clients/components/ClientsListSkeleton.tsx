export function ClientsListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="h-3 w-32 rounded-full bg-slate-200" />
        <div className="mt-3 h-10 w-56 rounded-lg bg-slate-300" />
        <div className="mt-4 h-5 max-w-2xl rounded-full bg-slate-100" />
      </section>
      <section className="grid gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]"
          />
        ))}
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_220px_220px_220px_auto]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-11 rounded-lg bg-slate-100" />
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="h-12 rounded-lg bg-slate-100" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-slate-100 bg-[var(--card)] p-4">
              <div className="h-4 w-36 rounded-full bg-slate-200" />
              <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
              <div className="mt-2 h-4 w-10/12 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
