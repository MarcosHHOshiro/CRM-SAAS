const featureCards = [
  {
    title: 'Feature-based frontend',
    description: 'UI state, services, and route segments are organized for steady product growth.',
  },
  {
    title: 'Modular backend ready',
    description: 'The API starts as a modular monolith, leaving room for auth, leads, and tenant-safe flows.',
  },
  {
    title: 'Shared workspace config',
    description: 'TypeScript, ESLint, and reusable types live in packages so both apps stay aligned.',
  },
];

export function DashboardHero() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-lg border bg-[var(--card)] p-8 backdrop-blur">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          Starter dashboard
        </p>
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
          A clean Turborepo foundation for a professional CRM SaaS.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
          This workspace is ready for the first business modules, tenant-safe APIs, and the initial product
          experience in Next.js.
        </p>
      </div>
      <div className="grid gap-4">
        {featureCards.map((card) => (
          <article key={card.title} className="rounded-lg border bg-[var(--card)] p-5 backdrop-blur">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

