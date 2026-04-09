import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

const summaryCards = [
  {
    label: 'API integration',
    value: 'Ready',
    detail: 'Central client with token refresh and predictable error handling.',
  },
  {
    label: 'Session state',
    value: 'Connected',
    detail: 'TanStack Query keeps `/auth/me` and private screens in sync.',
  },
  {
    label: 'Workspace shell',
    value: 'Online',
    detail: 'Sidebar, header, and navigation are prepared for the next feature pages.',
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="The frontend foundation is now connected to the NestJS backend, with authentication, route protection, and the private application shell ready for the next CRM modules."
        eyebrow="Dashboard"
        title="A strong base for the CRM product experience"
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow-soft)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {card.label}
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">{card.value}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">{card.detail}</p>
          </article>
        ))}
      </section>

      <FeaturePlaceholder
        description="This area is ready for the first real dashboard queries such as KPIs, charts, pipeline counts, and activity summaries. The surrounding layout and auth flow are already in place so the next pages can stay focused on business logic."
        highlights={[
          'Authenticated requests automatically attach the access token.',
          'Expired access tokens can renew through the backend refresh endpoint.',
          'Private routes redirect unauthenticated users back to login.',
        ]}
        title="Start adding business metrics without reworking the app shell"
      />
    </div>
  );
}
