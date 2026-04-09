import type { AppMessages } from '@/i18n/messages/types';

export function getNavigationItems(messages: AppMessages) {
  return [
    {
      description: messages.shell.nav.dashboard.description,
      href: '/dashboard',
      label: messages.shell.nav.dashboard.label,
    },
    {
      description: messages.shell.nav.leads.description,
      href: '/leads',
      label: messages.shell.nav.leads.label,
    },
    {
      description: messages.shell.nav.clients.description,
      href: '/clients',
      label: messages.shell.nav.clients.label,
    },
    {
      description: messages.shell.nav.opportunities.description,
      href: '/opportunities',
      label: messages.shell.nav.opportunities.label,
    },
    {
      description: messages.shell.nav.activities.description,
      href: '/activities',
      label: messages.shell.nav.activities.label,
    },
    {
      description: messages.shell.nav.users.description,
      href: '/users',
      label: messages.shell.nav.users.label,
    },
    {
      description: messages.shell.nav.settings.description,
      href: '/settings',
      label: messages.shell.nav.settings.label,
    },
  ] as const;
}
