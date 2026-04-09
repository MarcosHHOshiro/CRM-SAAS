import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="This area is prepared for organization settings, profile preferences, and workspace-level configuration."
        eyebrow="Settings"
        title="Workspace settings can be added cleanly"
      />
      <FeaturePlaceholder
        description="The page structure and private shell already give settings a stable place to grow as soon as the corresponding API flows are ready."
        highlights={[
          'Current organization information is available in the shell header.',
          'Auth state is persisted through browser reloads and tab restores.',
          'The frontend is organized by feature, ready for deeper settings modules.',
        ]}
        title="Add organization and profile forms next"
      />
    </div>
  );
}
