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
  const options = [
    {
      icon: <SunIcon />,
      label: messages.common.theme.light,
      mode: 'light',
    },
    {
      icon: <MoonIcon />,
      label: messages.common.theme.dark,
      mode: 'dark',
    },
  ] satisfies Array<{ icon: React.ReactNode; label: string; mode: ThemeMode }>;

  if (compact || !showLabels) {
    return (
      <button
        aria-label={actionLabel}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground-muted)] shadow-[var(--shadow-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] ${className}`.trim()}
        onClick={() => {
          applyTheme(nextTheme);
          setTheme(nextTheme);
        }}
        title={actionLabel}
        type="button"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <div
      aria-label={messages.common.theme.toggle}
      className={`grid grid-cols-2 gap-1 rounded-lg border border-[var(--border)] bg-[var(--card-dark)] p-1 shadow-[var(--shadow-soft)] ${
        fullWidth ? 'w-full' : 'w-[10.5rem]'
      } ${className}`.trim()}
      role="group"
    >
      {options.map((option) => {
        const isSelected = theme === option.mode;

        return (
          <button
            aria-pressed={isSelected}
            className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold transition-colors ${
              isSelected
                ? 'bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--border)]'
                : 'text-[var(--foreground-muted)] hover:bg-[color:rgb(var(--card-rgb)/0.55)] hover:text-[var(--foreground)]'
            }`}
            key={option.mode}
            onClick={() => {
              applyTheme(option.mode);
              setTheme(option.mode);
            }}
            type="button"
          >
            <span
              className={`${
                isSelected ? 'text-[var(--accent)]' : 'text-[var(--foreground-muted)]'
              }`}
            >
              {option.icon}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
