export function OpportunitiesListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="h-4 w-36 rounded-full bg-slate-200" />
        <div className="mt-4 h-10 w-80 rounded-full bg-slate-300" />
        <div className="mt-4 h-5 max-w-2xl rounded-full bg-slate-100" />
      </section>
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr_auto]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-[1.4rem] border border-slate-100 bg-white/70 p-4">
              <div className="h-5 w-52 rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
              <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
