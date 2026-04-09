'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useTranslation } from '@/i18n/use-translation';
import { buildLoginHref } from '@/lib/routes';

import { useCurrentSessionQuery } from '../hooks/use-auth';
import { PrivateAppShell } from '@/features/shell/components/PrivateAppShell';

type AuthGuardProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionQuery = useCurrentSessionQuery();
  const { messages } = useTranslation();
  const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  useEffect(() => {
    if (currentSessionQuery.isError) {
      router.replace(buildLoginHref(nextPath));
    }
  }, [currentSessionQuery.isError, nextPath, router]);

  if (currentSessionQuery.isPending || !currentSessionQuery.data) {
    return (
      <LoadingScreen
        description={messages.common.loading.authGuardDescription}
        title={messages.common.loading.authGuardTitle}
      />
    );
  }

  return <PrivateAppShell session={currentSessionQuery.data}>{children}</PrivateAppShell>;
}
