'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useTranslation } from '@/i18n/use-translation';

import { useLogoutMutation } from '../hooks/use-auth';

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { messages } = useTranslation();

  async function handleLogout() {
    setErrorMessage(null);

    try {
      await logoutMutation.mutateAsync();
    } catch {
      setErrorMessage(messages.auth.logout.fallbackError);
    } finally {
      router.replace('/login');
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={logoutMutation.isPending}
        onClick={handleLogout}
        type="button"
      >
        {logoutMutation.isPending ? messages.auth.logout.submitting : messages.auth.logout.submit}
      </button>
      {errorMessage ? (
        <p className="max-w-xs text-right text-xs leading-5 text-[var(--danger)]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
