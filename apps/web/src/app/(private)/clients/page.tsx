import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="This page will hold the customer directory, account context, and client details once those backend endpoints are connected."
        eyebrow="Clients"
        title="Client records are ready for implementation"
      />
      <FeaturePlaceholder
        description="You can now add client queries and forms without rebuilding navigation, auth persistence, or layout structure."
        highlights={[
          'Protected layout already exposes organization and user context.',
          'Session refresh keeps longer private browsing flows stable.',
          'The page is organized to stay thin while feature logic lives elsewhere.',
        ]}
        title="Add customer-facing workflows next"
      />
    </div>
  );
}
