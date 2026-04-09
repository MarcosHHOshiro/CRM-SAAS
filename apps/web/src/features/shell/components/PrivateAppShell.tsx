'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { formatUserRole } from '@/lib/format';

import { LogoutButton } from '@/features/auth/components/LogoutButton';
import type { CurrentSession } from '@/features/auth/types/auth';

import { navigationItems } from '../config/navigation';

type PrivateAppShellProps = Readonly<{
  children: React.ReactNode;
  session: CurrentSession;
}>;

export function PrivateAppShell({ children, session }: PrivateAppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto mb-4 flex max-w-[1500px] items-center justify-between gap-3 rounded-[1.7rem] border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-[var(--shadow-soft)] lg:hidden">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Pulse CRM
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--foreground)]">
            {session.organization.name}
          </p>
        </div>
        <button
          aria-expanded={isSidebarOpen}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          onClick={() => {
            setIsSidebarOpen((currentValue) => !currentValue);
          }}
          type="button"
        >
          {isSidebarOpen ? 'Close menu' : 'Open menu'}
        </button>
      </div>

      {isSidebarOpen ? (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
          }}
          type="button"
        />
      ) : null}

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1500px] flex-col gap-6 lg:flex-row">
        <aside
          className={`fixed inset-y-4 left-4 z-40 flex w-[min(20rem,calc(100vw-2rem))] flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card-dark)] p-5 text-white shadow-[var(--shadow-soft)] transition-transform duration-200 lg:sticky lg:top-6 lg:z-auto lg:min-h-[calc(100vh-3rem)] lg:w-[300px] lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-3 lg:block">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                  Pulse CRM
                </p>
                <h1 className="mt-4 text-2xl font-semibold leading-tight">
                  {session.organization.name}
                </h1>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-200 hover:bg-white/10 lg:hidden"
                onClick={() => {
                  setIsSidebarOpen(false);
                }}
                type="button"
              >
                X
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {session.organization.slug}
            </p>
          </div>

          <nav className="mt-6 flex-1 space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  className={`block rounded-[1.4rem] px-4 py-3 ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-[0_18px_40px_rgba(0,0,0,0.18)]'
                      : 'text-slate-200 hover:bg-white/8 hover:text-white'
                  }`}
                  href={item.href}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
            <p className="mt-3 text-sm font-semibold text-white">{session.user.name}</p>
            <p className="mt-1 text-sm text-slate-300">{session.user.email}</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Organization workspace
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {session.organization.name}
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">{session.user.name}</p>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {formatUserRole(session.user.role)}
                </p>
              </div>
              <LogoutButton />
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
