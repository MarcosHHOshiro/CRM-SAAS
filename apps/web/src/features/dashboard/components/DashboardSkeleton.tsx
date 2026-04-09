export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-6 py-7 shadow-[var(--shadow-soft)]">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="mt-4 h-10 max-w-xl rounded-full bg-slate-200" />
        <div className="mt-4 h-5 max-w-3xl rounded-full bg-slate-100" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <article
            key={index}
            className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="h-4 w-24 rounded-full bg-slate-200" />
            <div className="mt-5 h-9 w-20 rounded-full bg-slate-300" />
            <div className="mt-5 h-4 w-full rounded-full bg-slate-100" />
            <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={index}
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="mt-4 h-8 w-48 rounded-full bg-slate-300" />
            <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((__, itemIndex) => (
                <div key={itemIndex} className="rounded-[1.5rem] border border-slate-100 bg-white/70 p-4">
                  <div className="h-4 w-24 rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
                  <div className="mt-2 h-4 w-3/4 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
