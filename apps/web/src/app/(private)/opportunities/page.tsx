import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="Pipeline pages, stage movement, and opportunity forms can plug into this area without changing the surrounding app shell."
        eyebrow="Opportunities"
        title="Pipeline UI can be layered in next"
      />
      <FeaturePlaceholder
        description="The authenticated workspace is already ready for revenue-focused flows such as kanban boards, detail drawers, and stage updates."
        highlights={[
          'Navigation already reserves the opportunity area in the shell.',
          'Central API helpers support future stage update mutations.',
          'Loading and error states have a shared baseline to build on.',
        ]}
        title="Start with the first opportunity list or kanban view"
      />
    </div>
  );
}
