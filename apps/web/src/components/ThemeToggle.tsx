'use client';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/i18n/use-translation';
import { applyTheme, getPreferredTheme, type ThemeMode } from '@/lib/theme';

type ThemeToggleProps = Readonly<{
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
}>;

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 15.4A8.5 8.5 0 0 1 8.6 4a8.5 8.5 0 1 0 11.4 11.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1M18.54 5.46l-1.48 1.48M6.94 17.06l-1.48 1.48M18.54 18.54l-1.48-1.48M6.94 6.94 5.46 5.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ThemeToggle({
  className = '',
  compact = false,
  fullWidth = false,
}: ThemeToggleProps) {
  const { messages } = useTranslation();
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const preferredTheme = getPreferredTheme();

    applyTheme(preferredTheme);
    setTheme(preferredTheme);
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const actionLabel =
    theme === 'dark' ? messages.common.theme.switchToLight : messages.common.theme.switchToDark;

  return (
    <button
      aria-label={actionLabel}
      className={`inline-flex min-h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] ${
        compact ? 'h-10 w-10 justify-center px-0' : fullWidth ? 'w-full justify-between' : 'gap-2'
      } ${className}`.trim()}
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      title={actionLabel}
      type="button"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </span>
      {compact ? <span className="sr-only">{messages.common.theme.toggle}</span> : <span>{actionLabel}</span>}
    </button>
  );
}
