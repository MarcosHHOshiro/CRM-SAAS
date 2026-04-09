'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { buildLoginHref } from '@/lib/routes';

import { clearAuthSession, hasStoredSession } from '../lib/auth-storage';
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
  const hasSession = hasStoredSession();
  const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  useEffect(() => {
    if (!hasSession) {
      router.replace(buildLoginHref(nextPath));
    }
  }, [hasSession, nextPath, router]);

  useEffect(() => {
    if (currentSessionQuery.isError) {
      clearAuthSession();
      router.replace(buildLoginHref(nextPath));
    }
  }, [currentSessionQuery.isError, nextPath, router]);

  if (!hasSession || currentSessionQuery.isPending || !currentSessionQuery.data) {
    return (
      <LoadingScreen
        description="We are validating your session and loading the latest organization context."
        title="Preparing your workspace"
      />
    );
  }

  return <PrivateAppShell session={currentSessionQuery.data}>{children}</PrivateAppShell>;
}
