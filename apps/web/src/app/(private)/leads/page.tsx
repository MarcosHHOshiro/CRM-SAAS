import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="This section is ready for the upcoming lead capture, listing, filtering, and conversion flows."
        eyebrow="Leads"
        title="Lead management foundation"
      />
      <FeaturePlaceholder
        description="The routing, auth, and shell are already prepared, so the next step here can focus on the actual CRM lead workflows and tenant-safe API queries."
        highlights={[
          'Feature route already lives inside the protected app shell.',
          'TanStack Query is ready for lead listing hooks and mutations.',
          'Shared API utilities are available for consistent request handling.',
        ]}
        title="Build the first lead screens on top of a stable base"
      />
    </div>
  );
}
