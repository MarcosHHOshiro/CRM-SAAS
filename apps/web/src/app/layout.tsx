import type { Metadata } from 'next';

import { QueryProvider } from '@/services/query/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse CRM',
  description: 'Multi-tenant SaaS CRM frontend foundation.',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
