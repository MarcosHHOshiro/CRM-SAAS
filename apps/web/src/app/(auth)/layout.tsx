type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,#10251b_0%,#153325_54%,#1c4632_100%)] px-6 py-8 text-white shadow-[var(--shadow-soft)] sm:px-10 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,rgba(120,255,205,0.18),transparent_52%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/80">Pulse CRM</p>
              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Sales teams, tenant-safe by default.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-emerald-50/82">
                This workspace is prepared to connect Next.js directly to the existing NestJS backend with a clean auth flow, protected routes, and a private application shell that can grow feature by feature.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-semibold">01</p>
                <p className="mt-3 text-sm leading-6 text-emerald-50/76">Register an organization and create the first owner account.</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-semibold">02</p>
                <p className="mt-3 text-sm leading-6 text-emerald-50/76">Sign in and hydrate the session from `/auth/me`.</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-semibold">03</p>
                <p className="mt-3 text-sm leading-6 text-emerald-50/76">Move into the private shell and start building product modules.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">{children}</section>
      </div>
    </main>
  );
}
