import type { AppMessages } from './types';

export const enMessages: AppMessages = {
  auth: {
    layout: {
      title: 'Sales teams, tenant-safe by default.',
      description:
        'This workspace is prepared to connect Next.js directly to the existing NestJS backend with a clean auth flow, protected routes, and a private application shell that can grow feature by feature.',
      steps: [
        'Register an organization and create the first owner account.',
        'Sign in and hydrate the session from `/auth/me`.',
        'Move into the private shell and start building product modules.',
      ],
    },
    loginPage: {
      title: 'Welcome back',
      description:
        'Sign in with the owner or team member account already registered in your organization.',
    },
    loginForm: {
      emailLabel: 'Work email',
      emailPlaceholder: 'you@company.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      submit: 'Sign in',
      submitting: 'Signing in...',
      switchPrompt: 'New to Pulse CRM?',
      switchLink: 'Create your workspace',
      fallbackError: 'Unable to sign in right now.',
    },
    logout: {
      submit: 'Logout',
      submitting: 'Signing out...',
      fallbackError:
        'We could not confirm logout with the API, but the local session was cleared.',
    },
    registerPage: {
      title: 'Create your workspace',
      description:
        'Create the first organization workspace and owner account to start using the CRM.',
    },
    registerForm: {
      organizationNameLabel: 'Organization name',
      organizationNamePlaceholder: 'Northwind Sales',
      organizationSlugLabel: 'Organization slug',
      organizationSlugPlaceholder: 'northwind-sales',
      organizationSlugHint: 'Optional. Used in workspace URLs and must be unique.',
      nameLabel: 'Your name',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Work email',
      emailPlaceholder: 'alex@northwind.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a password',
      passwordHint: 'At least 8 characters.',
      submit: 'Create workspace',
      submitting: 'Creating workspace...',
      switchPrompt: 'Already have an account?',
      switchLink: 'Sign in',
      fallbackError: 'Unable to create your workspace right now.',
    },
    validation: {
      emailInvalid: 'Enter a valid email address.',
      organizationNameMin: 'Organization name must have at least 2 characters.',
      organizationNameMax: 'Organization name must have at most 120 characters.',
      organizationSlugPattern: 'Use only lowercase letters, numbers, and hyphens.',
      organizationSlugMin: 'Slug must have at least 2 characters.',
      organizationSlugMax: 'Slug must have at most 80 characters.',
      nameMin: 'Your name must have at least 2 characters.',
      nameMax: 'Your name must have at most 120 characters.',
      passwordMin: 'Password must have at least 8 characters.',
      passwordMax: 'Password must have at most 72 characters.',
    },
  },
  common: {
    brand: 'Pulse CRM',
    loading: {
      title: 'Loading your CRM',
      description: 'Preparing your workspace and session details.',
      privateTitle: 'Opening workspace',
      privateDescription: 'Loading the next CRM workspace view and preparing the latest data.',
      authGuardTitle: 'Preparing your workspace',
      authGuardDescription:
        'We are validating your session and loading the latest organization context.',
    },
    actions: {
      close: 'Close',
      tryAgain: 'Try again',
      goToDashboard: 'Go to dashboard',
    },
  },
  errors: {
    notFound: {
      eyebrow: '404',
      title: 'This page does not exist.',
      description: 'The route may have moved or the session may have redirected elsewhere.',
      cta: 'Go to dashboard',
    },
  },
  roles: {
    OWNER: 'Owner',
    MANAGER: 'Manager',
    SALES_REP: 'Sales rep',
  },
  shell: {
    mobileMenuOpen: 'Open menu',
    mobileMenuClose: 'Close menu',
    closeNavigationAriaLabel: 'Close navigation menu',
    signedInAs: 'Signed in as',
    workspaceEyebrow: 'Organization workspace',
    nav: {
      dashboard: {
        label: 'Dashboard',
        description: 'Overview and performance summary',
      },
      leads: {
        label: 'Leads',
        description: 'Prospect pipeline and intake',
      },
      clients: {
        label: 'Clients',
        description: 'Customer records and accounts',
      },
      opportunities: {
        label: 'Opportunities',
        description: 'Revenue pipeline and stages',
      },
      activities: {
        label: 'Activities',
        description: 'Tasks, notes, and follow-ups',
      },
      users: {
        label: 'Users',
        description: 'Team members and permissions',
      },
      settings: {
        label: 'Settings',
        description: 'Workspace and organization settings',
      },
    },
  },
};
