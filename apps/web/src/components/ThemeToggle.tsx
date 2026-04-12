'use client';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/i18n/use-translation';
import { applyTheme, getPreferredTheme, type ThemeMode } from '@/lib/theme';

type ThemeToggleProps = Readonly<{
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  showLabels?: boolean;
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
  showLabels = true,
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
  const isDark = theme === 'dark';
  const knobStyle = compact
    ? {
        transform: `translate(${isDark ? '2rem' : '0rem'}, -50%)`,
      }
    : {
        transform: `translate(${isDark ? 'calc(100% + 0.1rem)' : '0rem'}, -50%)`,
      };

  return (
    <button
      aria-label={actionLabel}
      className={`group relative inline-flex items-center overflow-hidden border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:border-[var(--accent)] ${
        compact
          ? 'h-10 w-[4.4rem] rounded-full px-1.5'
          : !showLabels
            ? 'h-10 w-[4.8rem] rounded-full px-1.5'
          : fullWidth
            ? 'min-h-[3.1rem] w-full rounded-full px-2 py-1.5'
            : 'min-h-[3.1rem] w-[10.25rem] rounded-full px-2 py-1.5'
      } ${className}`.trim()}
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      title={actionLabel}
      type="button"
    >
      <span
        className={`pointer-events-none absolute rounded-full border border-[var(--border)] bg-[var(--card-dark)] ${
          compact || !showLabels
            ? 'inset-y-[6px] left-2 right-2'
            : 'inset-y-[6px] left-2 right-2'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-2 rounded-full border border-[var(--border)] bg-[var(--card-strong)] text-[var(--accent)] shadow-[var(--shadow-soft)] transition-transform duration-200 ${
          compact || !showLabels
            ? 'h-[1.875rem] w-[1.875rem]'
            : 'h-[2rem] w-[calc(50%-0.28rem)]'
        }`}
        style={knobStyle}
      >
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </span>
      </span>
      {compact || !showLabels ? (
        <span className="sr-only">{messages.common.theme.toggle}</span>
      ) : (
        <span className="relative z-10 grid flex-1 grid-cols-2 items-center text-[0.66rem] font-semibold uppercase tracking-[0.16em]">
          <span className={`text-center transition-colors ${isDark ? 'text-[var(--foreground-muted)]' : 'text-[var(--foreground)]'}`}>
            {messages.common.theme.light}
          </span>
          <span className={`text-center transition-colors ${isDark ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>
            {messages.common.theme.dark}
          </span>
        </span>
      )}
    </button>
  );
}
