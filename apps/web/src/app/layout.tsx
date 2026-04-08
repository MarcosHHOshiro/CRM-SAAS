import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'CRM SaaS',
  description: 'Multi-tenant SaaS CRM starter workspace.',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
