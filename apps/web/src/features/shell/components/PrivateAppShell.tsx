'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslation } from '@/i18n/use-translation';

import { LogoutButton } from '@/features/auth/components/LogoutButton';
import type { CurrentSession } from '@/features/auth/types/auth';

import { getNavigationItems } from '../config/navigation';

type PrivateAppShellProps = Readonly<{
  children: React.ReactNode;
  session: CurrentSession;
}>;

const desktopSidebarStorageKey = 'private-sidebar-collapsed';

function NavigationIcon({ href }: { href: string }) {
  if (href === '/dashboard') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect height="7" rx="1.5" width="7" x="3" y="3" />
        <rect height="5" rx="1.5" width="8" x="13" y="3" />
        <rect height="10" rx="1.5" width="8" x="13" y="10.5" />
        <rect height="8" rx="1.5" width="7" x="3" y="12.5" />
      </svg>
    );
  }

  if (href === '/leads') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M15 19v-1.4a3.8 3.8 0 0 0-3.8-3.8H7.8A3.8 3.8 0 0 0 4 17.6V19" />
        <circle cx="9.5" cy="7.9" r="3.6" />
        <path d="M18 8v6M15 11h6" />
      </svg>
    );
  }

  if (href === '/clients') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect height="15" rx="2" width="13" x="4.5" y="4.5" />
        <path d="M8 19.5v-4h6v4M8 8h2M12 8h2M8 11h2M12 11h2M17.5 8.5h2v9h-2" />
      </svg>
    );
  }

  if (href === '/opportunities') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 19.5h16M7 16v-3.5M12 16V8.5M17 16v-6.5" />
        <path d="m7 9 4-3.5L14.2 8 20 4.5" />
      </svg>
    );
  }

  if (href === '/activities') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 12h4l2.1-4.3L13 17l2.2-5H21" />
      </svg>
    );
  }

  if (href === '/users') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M16.5 18.2v-1a3.2 3.2 0 0 0-3.2-3.2h-6a3.2 3.2 0 0 0-3.2 3.2v1" />
        <circle cx="10.3" cy="8.5" r="3.2" />
        <path d="M22 18.2v-1a3.2 3.2 0 0 0-2.6-3.1M16.2 5.4a3.2 3.2 0 0 1 0 6.2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.8 1.8 0 0 1 0 2.6l-.1.1a1.8 1.8 0 0 1-2.6 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.8 1.8 0 0 1-1.8 1.8h-.8A1.8 1.8 0 0 1 10.8 20v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.8 1.8 0 0 1-2.6 0l-.1-.1a1.8 1.8 0 0 1 0-2.6l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5.5A1.8 1.8 0 0 1 3.7 13v-.8a1.8 1.8 0 0 1 1.8-1.8h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.8 1.8 0 0 1 0-2.6l.1-.1a1.8 1.8 0 0 1 2.6 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1.8 1.8 0 0 1 1.8-1.8h.8A1.8 1.8 0 0 1 14.2 4v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.8 1.8 0 0 1 2.6 0l.1.1a1.8 1.8 0 0 1 0 2.6l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.8 1.8 0 0 1 1.8 1.8v.8a1.8 1.8 0 0 1-1.8 1.8h-.2a1 1 0 0 0-.9.6Z" />
    </svg>
  );
}

export function PrivateAppShell({ children, session }: PrivateAppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const { messages } = useTranslation();
  const navigationItems = getNavigationItems(messages);
  const roleLabel = messages.roles[session.user.role];
  const userInitials = session.user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase() ?? '')
    .join('');
  const organizationInitial = session.organization.name.charAt(0).toUpperCase();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(desktopSidebarStorageKey);

    setIsDesktopSidebarCollapsed(storedValue === 'true');
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      desktopSidebarStorageKey,
      String(isDesktopSidebarCollapsed),
    );
  }, [isDesktopSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 px-4 py-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1640px] items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:rgba(255,92,53,0.26)] bg-[var(--card)] text-xs font-semibold text-[var(--accent)]">
              {organizationInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {messages.common.brand}
              </p>
              <p className="truncate text-xs text-[var(--foreground-muted)]">
                {session.organization.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              aria-expanded={isSidebarOpen}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              onClick={() => {
                setIsSidebarOpen((currentValue) => !currentValue);
              }}
              type="button"
            >
              {isSidebarOpen ? messages.shell.mobileMenuClose : messages.shell.mobileMenuOpen}
            </button>
          </div>
        </div>
      </header>

      {isSidebarOpen ? (
        <button
          aria-label={messages.shell.closeNavigationAriaLabel}
          className="fixed inset-0 z-30 bg-[color:var(--overlay)] lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
          }}
          type="button"
        />
      ) : null}

      <div className="flex min-h-screen w-full">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[272px] border-r border-[var(--border)] bg-[var(--sidebar)] px-3 py-4 transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:transition-[width] ${
            isDesktopSidebarCollapsed ? 'lg:w-[104px]' : 'lg:w-[272px]'
          } ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:rgba(255,92,53,0.26)] bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                    {organizationInitial}
                  </div>
                  {isDesktopSidebarCollapsed ? null : (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                        {messages.common.brand}
                      </p>
                      <p className="truncate text-xs text-[var(--foreground-muted)]">
                        {session.organization.name}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  aria-label={
                    isDesktopSidebarCollapsed
                      ? messages.shell.mobileMenuOpen
                      : messages.shell.mobileMenuClose
                  }
                  className="hidden h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-strong)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] lg:inline-flex"
                  onClick={() => {
                    setIsDesktopSidebarCollapsed((currentValue) => !currentValue);
                  }}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform ${
                      isDesktopSidebarCollapsed ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-strong)] text-sm font-semibold text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] lg:hidden"
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                  type="button"
                >
                  X
                </button>
              </div>
            </div>

            {isDesktopSidebarCollapsed ? null : (
              <p className="mt-5 px-2 text-[11px] font-semibold text-[var(--foreground-muted)]">
                {messages.shell.workspaceEyebrow}
              </p>
            )}

            <nav className="mt-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    className={`flex items-center rounded-lg border py-2.5 text-sm ${
                      isActive
                        ? 'border-[color:rgba(255,92,53,0.28)] bg-[var(--accent-soft)] text-[var(--foreground)]'
                        : 'border-transparent text-[var(--foreground)] hover:border-[var(--border)] hover:bg-[var(--card)]'
                    } ${isDesktopSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
                    href={item.href}
                    title={item.label}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                        isActive
                          ? 'border-[color:rgba(255,92,53,0.28)] bg-[var(--card-strong)] text-[var(--accent)]'
                          : 'border-[var(--border)] bg-[var(--card-strong)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      <NavigationIcon href={item.href} />
                    </span>
                    {isDesktopSidebarCollapsed ? null : (
                      <span className="truncate font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div
              className={`mt-auto rounded-lg border border-[var(--border)] bg-[var(--card)] py-3 ${
                isDesktopSidebarCollapsed ? 'px-2' : 'px-3'
              }`}
            >
              <div
                className={`flex ${
                  isDesktopSidebarCollapsed ? 'justify-center' : 'items-center gap-3'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                  {userInitials}
                </div>
                {isDesktopSidebarCollapsed ? null : (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-[var(--foreground-muted)]">{roleLabel}</p>
                  </div>
                )}
              </div>
              <div className={`mt-3 ${isDesktopSidebarCollapsed ? 'flex justify-center' : ''}`}>
                <ThemeToggle compact={isDesktopSidebarCollapsed} fullWidth={!isDesktopSidebarCollapsed} />
              </div>
              <div className={`mt-3 ${isDesktopSidebarCollapsed ? 'flex justify-center' : ''}`}>
                <LogoutButton align="start" fullWidth={!isDesktopSidebarCollapsed} />
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1392px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
