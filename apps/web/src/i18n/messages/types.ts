export type AppMessages = {
  auth: {
    layout: {
      title: string;
      description: string;
      steps: [string, string, string];
    };
    loginPage: {
      title: string;
      description: string;
    };
    loginForm: {
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submit: string;
      submitting: string;
      switchPrompt: string;
      switchLink: string;
      fallbackError: string;
    };
    logout: {
      submit: string;
      submitting: string;
      fallbackError: string;
    };
    registerPage: {
      title: string;
      description: string;
    };
    registerForm: {
      organizationNameLabel: string;
      organizationNamePlaceholder: string;
      organizationSlugLabel: string;
      organizationSlugPlaceholder: string;
      organizationSlugHint: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      passwordHint: string;
      submit: string;
      submitting: string;
      switchPrompt: string;
      switchLink: string;
      fallbackError: string;
    };
    validation: {
      emailInvalid: string;
      organizationNameMin: string;
      organizationNameMax: string;
      organizationSlugPattern: string;
      organizationSlugMin: string;
      organizationSlugMax: string;
      nameMin: string;
      nameMax: string;
      passwordMin: string;
      passwordMax: string;
    };
  };
  common: {
    brand: string;
    loading: {
      title: string;
      description: string;
      privateTitle: string;
      privateDescription: string;
      authGuardTitle: string;
      authGuardDescription: string;
    };
    actions: {
      close: string;
      tryAgain: string;
      goToDashboard: string;
    };
  };
  errors: {
    notFound: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
  };
  roles: {
    OWNER: string;
    MANAGER: string;
    SALES_REP: string;
  };
  shell: {
    mobileMenuOpen: string;
    mobileMenuClose: string;
    closeNavigationAriaLabel: string;
    signedInAs: string;
    workspaceEyebrow: string;
    nav: {
      dashboard: {
        label: string;
        description: string;
      };
      leads: {
        label: string;
        description: string;
      };
      clients: {
        label: string;
        description: string;
      };
      opportunities: {
        label: string;
        description: string;
      };
      activities: {
        label: string;
        description: string;
      };
      users: {
        label: string;
        description: string;
      };
      settings: {
        label: string;
        description: string;
      };
    };
  };
};

export type AppLocale = 'en' | 'pt-BR';
