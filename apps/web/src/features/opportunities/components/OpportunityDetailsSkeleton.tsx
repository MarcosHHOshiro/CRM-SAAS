export function OpportunityDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="h-4 w-32 rounded-full bg-slate-200" />
        <div className="mt-4 h-10 w-80 rounded-full bg-slate-300" />
        <div className="mt-4 h-5 max-w-2xl rounded-full bg-slate-100" />
      </section>
      <section className="space-y-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={index}
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="h-8 w-44 rounded-full bg-slate-300" />
            <div className="mt-6 grid gap-4">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div key={itemIndex} className="rounded-[1.4rem] bg-white/60 p-4">
                  <div className="h-4 w-20 rounded-full bg-slate-200" />
                  <div className="mt-3 h-5 w-44 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
