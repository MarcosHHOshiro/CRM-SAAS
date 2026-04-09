import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { PageIntro } from '@/components/PageIntro';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        description="User management can grow here with role-based team administration, invitations, and activation controls."
        eyebrow="Users"
        title="Team administration shell is in place"
      />
      <FeaturePlaceholder
        description="The next increment can focus on backend user endpoints and role-aware UI without revisiting session, routing, or core layout concerns."
        highlights={[
          'Current user context is already fetched from `/auth/me`.',
          'Role display is wired into the shared shell header.',
          'Navigation is ready for future permission-aware states.',
        ]}
        title="Layer team management into the protected workspace"
      />
    </div>
  );
}
