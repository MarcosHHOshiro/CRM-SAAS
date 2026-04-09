import type { Metadata } from 'next';

import { ToastProvider } from '@/components/ToastProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getRequestI18n } from '@/i18n/request';
import { QueryProvider } from '@/services/query/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse CRM',
  description: 'Multi-tenant SaaS CRM frontend foundation.',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const { locale, messages } = await getRequestI18n();

  return (
    <html lang={locale}>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
