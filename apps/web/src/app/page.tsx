import { AppShell } from '@/components/AppShell';
import { DashboardHero } from '@/features/dashboard/components/DashboardHero';

export default function HomePage() {
  return (
    <AppShell>
      <DashboardHero />
    </AppShell>
  );
}

