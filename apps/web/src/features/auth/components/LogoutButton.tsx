'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useTranslation } from '@/i18n/use-translation';

import { useLogoutMutation } from '../hooks/use-auth';

type LogoutButtonProps = Readonly<{
  align?: 'end' | 'start';
  fullWidth?: boolean;
}>;

export function LogoutButton({ align = 'end', fullWidth = false }: LogoutButtonProps) {
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
    <div className={`flex flex-col gap-2 ${align === 'start' ? 'items-start' : 'items-end'}`}>
      <button
        className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-strong)] px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70 ${fullWidth ? 'w-full' : ''}`}
        disabled={logoutMutation.isPending}
        onClick={handleLogout}
        type="button"
      >
        {logoutMutation.isPending ? messages.auth.logout.submitting : messages.auth.logout.submit}
      </button>
      {errorMessage ? (
        <p
          className={`max-w-xs text-xs leading-5 text-[var(--danger)] ${align === 'start' ? 'text-left' : 'text-right'}`}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
