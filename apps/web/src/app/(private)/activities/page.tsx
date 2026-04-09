import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="This route is ready for timeline feeds, note entry, task scheduling, and activity history tied to CRM records."
        eyebrow="Activities"
        title="Activity tracking has a prepared home"
      />
      <FeaturePlaceholder
        description="You can build activity lists and creation forms here while reusing the shared auth state and API integration layer."
        highlights={[
          'Private route protection is already handled globally.',
          'Forms can reuse Zod validation patterns established in auth.',
          'The layout keeps page modules focused on business screens.',
        ]}
        title="Add follow-up and history views next"
      />
    </div>
  );
}
