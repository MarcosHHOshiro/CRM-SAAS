'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useToast } from '@/components/ToastProvider';

type UseQueryFeedbackToastOptions = Readonly<{
  paramName?: string;
  tone?: 'error' | 'info' | 'success';
}>;

export function useQueryFeedbackToast(
  message: string | null,
  options: UseQueryFeedbackToastOptions = {},
) {
  const { paramName = 'success', tone = 'success' } = options;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    if (!message) {
      return;
    }

    showToast({ message, tone });

    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramName);

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [message, paramName, pathname, router, searchParams, showToast, tone]);
}
