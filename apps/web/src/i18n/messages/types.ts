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
  dashboard: {
    overview: {
      eyebrow: string;
      title: string;
      description: string;
      errorFallback: string;
    };
    empty: {
      eyebrow: string;
      title: string;
      description: string;
    };
    metrics: {
      totalLeads: string;
      totalLeadsDescription: string;
      totalClients: string;
      totalClientsDescription: string;
      openOpportunities: string;
      openOpportunitiesDescription: string;
      wonOpportunities: string;
      wonOpportunitiesDescription: string;
      lostOpportunities: string;
      lostOpportunitiesDescription: string;
      totalPipelineValue: string;
      totalPipelineValueDescription: string;
      conversionRate: string;
      conversionRateDescription: string;
    };
    pipeline: {
      eyebrow: string;
      description: string;
      trackedOpportunities: string;
      open: string;
      won: string;
      lost: string;
    };
    recentActivities: {
      eyebrow: string;
      title: string;
      description: string;
      items: string;
      emptyTitle: string;
      emptyDescription: string;
      system: string;
      byAuthor: string;
    };
    activityTypes: {
      CALL: string;
      EMAIL: string;
      MEETING: string;
      NOTE: string;
      TASK: string;
    };
    shared: {
      unknownDate: string;
      linkedTo: string;
      newRecorded: string;
    };
  };
  common: {
    brand: string;
    theme: {
      toggle: string;
      switchToDark: string;
      switchToLight: string;
    };
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
      cancel: string;
      tryAgain: string;
      goToDashboard: string;
      apply: string;
      reset: string;
      backToList: string;
      edit: string;
      view: string;
      previous: string;
      next: string;
      saveChanges: string;
      saving: string;
    };
  };
  clients: {
    list: {
      eyebrow: string;
      title: string;
      description: string;
      errorFallback: string;
      itemLabel: string;
      successCreated: string;
      successUpdated: string;
    };
    search: {
      eyebrow: string;
      title: string;
      description: string;
      fieldLabel: string;
      fieldPlaceholder: string;
      createButton: string;
    };
    empty: {
      eyebrow: string;
      noResultsTitle: string;
      noResultsDescription: string;
      noItemsTitle: string;
      noItemsDescription: string;
      createButton: string;
    };
    error: {
      eyebrow: string;
      title: string;
    };
    table: {
      client: string;
      owner: string;
      sourceLead: string;
      created: string;
      actions: string;
      noEmail: string;
      noPhone: string;
      noCompany: string;
      unassigned: string;
      createdDirectly: string;
    };
    details: {
      eyebrow: string;
      title: string;
      description: string;
      loadError: string;
      editButton: string;
      profileEyebrow: string;
      ownershipEyebrow: string;
      email: string;
      phone: string;
      company: string;
      created: string;
      noEmail: string;
      noPhone: string;
      noCompany: string;
      unassigned: string;
      sourceLead: string;
      createdDirectly: string;
    };
    create: {
      eyebrow: string;
      title: string;
      description: string;
      submit: string;
      errorFallback: string;
    };
    edit: {
      eyebrow: string;
      title: string;
      titleWithName: string;
      description: string;
      submit: string;
      errorFallback: string;
      loadError: string;
    };
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      owner: string;
      ownerHint: string;
      ownerUnavailable: string;
      ownerUnassigned: string;
      ownerInactiveSuffix: string;
    };
    validation: {
      companyMax: string;
      emailInvalid: string;
      nameMin: string;
      nameMax: string;
      ownerInvalid: string;
      phoneMax: string;
    };
  };
  leads: {
    list: {
      eyebrow: string;
      title: string;
      description: string;
      errorFallback: string;
      ownerUnavailable: string;
      itemLabel: string;
      deleteConfirm: string;
      convertConfirm: string;
      deleteSuccess: string;
      deleteError: string;
      convertSuccess: string;
      convertError: string;
    };
    filters: {
      eyebrow: string;
      title: string;
      description: string;
      createButton: string;
      searchLabel: string;
      searchPlaceholder: string;
      statusLabel: string;
      ownerLabel: string;
    };
    empty: {
      eyebrow: string;
      noResultsTitle: string;
      noResultsDescription: string;
      noItemsTitle: string;
      noItemsDescription: string;
      createButton: string;
    };
    error: {
      eyebrow: string;
      title: string;
    };
    table: {
      lead: string;
      status: string;
      owner: string;
      createdAt: string;
      actions: string;
      noEmail: string;
      noPhone: string;
      noCompany: string;
      unassigned: string;
      converting: string;
      convert: string;
      deleting: string;
      delete: string;
    };
    details: {
      eyebrow: string;
      title: string;
      description: string;
      loadError: string;
      editButton: string;
      convertButton: string;
      converting: string;
      deleteButton: string;
      deleting: string;
      deleteConfirm: string;
      convertConfirm: string;
      deleteError: string;
      convertError: string;
      profileEyebrow: string;
      email: string;
      phone: string;
      company: string;
      createdAt: string;
      notes: string;
      noNotes: string;
      ownershipEyebrow: string;
      unassigned: string;
      conversionEyebrow: string;
      converted: string;
      canConvert: string;
      cannotConvert: string;
    };
    create: {
      eyebrow: string;
      title: string;
      description: string;
      submit: string;
      errorFallback: string;
    };
    edit: {
      eyebrow: string;
      title: string;
      titleWithName: string;
      description: string;
      submit: string;
      errorFallback: string;
      loadError: string;
    };
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      status: string;
      owner: string;
      ownerHint: string;
      ownerUnavailable: string;
      notes: string;
      notesHint: string;
      notesPlaceholder: string;
      ownerInactiveSuffix: string;
      ownerUnassigned: string;
      allOwners: string;
      allStatuses: string;
    };
    shared: {
      statusNew: string;
      statusQualified: string;
      statusContacted: string;
      statusConverted: string;
      statusLost: string;
      unknownDate: string;
      successCreated: string;
      successUpdated: string;
      successDeleted: string;
      successConverted: string;
    };
    validation: {
      companyMax: string;
      emailInvalid: string;
      nameMin: string;
      nameMax: string;
      notesMax: string;
      ownerInvalid: string;
      phoneMax: string;
    };
  };
  users: {
    list: {
      eyebrow: string;
      title: string;
      description: string;
      currentAccessError: string;
      errorFallback: string;
      total: string;
      active: string;
      inactive: string;
      ctaTitle: string;
      ctaDescription: string;
      createButton: string;
      itemLabel: string;
      successCreated: string;
      successUpdated: string;
      statusActivated: string;
      statusDeactivated: string;
      statusUpdateError: string;
    };
    access: {
      eyebrow: string;
      title: string;
      description: string;
      ownerOnlyTitle: string;
      ownerOnlyDescription: string;
    };
    empty: {
      eyebrow: string;
      title: string;
      description: string;
      createButton: string;
    };
    error: {
      eyebrow: string;
      title: string;
    };
    table: {
      user: string;
      role: string;
      status: string;
      active: string;
      inactive: string;
      createdAt: string;
      actions: string;
      currentSessionUser: string;
      restricted: string;
      ownerLocked: string;
      currentUser: string;
      updating: string;
      activate: string;
      deactivate: string;
    };
    create: {
      eyebrow: string;
      title: string;
      description: string;
      loadingTitle: string;
      loadingDescription: string;
      loadError: string;
      submit: string;
      errorFallback: string;
    };
    edit: {
      eyebrow: string;
      title: string;
      titleWithName: string;
      description: string;
      loadingTitle: string;
      loadingDescription: string;
      loadError: string;
      notFound: string;
      submit: string;
      errorFallback: string;
      selfRoleHint: string;
    };
    form: {
      name: string;
      email: string;
      emailReadonly: string;
      password: string;
      passwordHint: string;
      passwordPlaceholder: string;
      passwordReadonly: string;
      role: string;
    };
    validation: {
      emailInvalid: string;
      nameMin: string;
      nameMax: string;
      passwordMin: string;
      passwordMax: string;
    };
  };
  opportunities: {
    list: {
      eyebrow: string;
      title: string;
      description: string;
      errorFallback: string;
      itemLabel: string;
    };
    pipeline: {
      eyebrow: string;
      title: string;
      description: string;
      errorFallback: string;
    };
    filters: {
      eyebrow: string;
      title: string;
      description: string;
      openPipeline: string;
      createButton: string;
      searchLabel: string;
      searchPlaceholder: string;
      stageLabel: string;
      statusLabel: string;
      ownerLabel: string;
      sortLabel: string;
      ownerUnavailable: string;
    };
    empty: {
      eyebrow: string;
      noResultsTitle: string;
      noResultsDescription: string;
      noItemsTitle: string;
      noItemsDescription: string;
      createButton: string;
      emptyStage: string;
    };
    error: {
      eyebrow: string;
      title: string;
    };
    viewSwitch: {
      list: string;
      pipeline: string;
    };
    table: {
      opportunity: string;
      stage: string;
      status: string;
      owner: string;
      value: string;
      closeDate: string;
      actions: string;
      noCompany: string;
      unassigned: string;
    };
    create: {
      eyebrow: string;
      title: string;
      description: string;
      noClientsInfo: string;
      submit: string;
      errorFallback: string;
    };
    edit: {
      eyebrow: string;
      title: string;
      titleWithName: string;
      description: string;
      submit: string;
      errorFallback: string;
      loadError: string;
    };
    details: {
      eyebrow: string;
      title: string;
      description: string;
      loadError: string;
      editButton: string;
      openPipeline: string;
      moveStage: string;
      profileEyebrow: string;
      client: string;
      estimatedValue: string;
      expectedClose: string;
      createdAt: string;
      notes: string;
      noNotes: string;
      ownershipEyebrow: string;
      unassigned: string;
      clientAccount: string;
      noClientEmail: string;
    };
    form: {
      title: string;
      titlePlaceholder: string;
      estimatedValue: string;
      estimatedValueHint: string;
      client: string;
      clientPlaceholder: string;
      clientReadonly: string;
      expectedCloseDate: string;
      initialStage: string;
      stageReadonly: string;
      owner: string;
      ownerHint: string;
      ownerUnavailable: string;
      notes: string;
      notesHint: string;
      notesPlaceholder: string;
      ownerInactiveSuffix: string;
      ownerUnassigned: string;
    };
    shared: {
      allStages: string;
      allStatuses: string;
      newestFirst: string;
      oldestFirst: string;
      highestValue: string;
      lowestValue: string;
      expectedCloseSort: string;
      allOwners: string;
      stageNew: string;
      stageQualification: string;
      stageProposal: string;
      stageNegotiation: string;
      stageWon: string;
      stageLost: string;
      statusOpen: string;
      statusWon: string;
      statusLost: string;
      unscheduled: string;
      unknownDate: string;
      successCreated: string;
      successUpdated: string;
      successStageUpdated: string;
      stageUpdating: string;
      stageUpdateError: string;
    };
    validation: {
      estimatedValueInvalid: string;
      expectedCloseInvalid: string;
      notesMax: string;
      ownerInvalid: string;
      titleMin: string;
      titleMax: string;
      clientInvalid: string;
    };
  };
  activities: {
    page: {
      eyebrow: string;
      title: string;
      description: string;
      errorFallback: string;
      authorUnavailable: string;
      createEyebrow: string;
      createTitle: string;
      createDescription: string;
      recentEyebrow: string;
      recentTitle: string;
      recentDescription: string;
      itemLabel: string;
    };
    filters: {
      type: string;
      author: string;
      lead: string;
      client: string;
      opportunity: string;
    };
    empty: {
      eyebrow: string;
      title: string;
      description: string;
    };
    error: {
      eyebrow: string;
      title: string;
    };
    form: {
      type: string;
      lead: string;
      client: string;
      opportunity: string;
      description: string;
      descriptionHint: string;
      descriptionPlaceholder: string;
      submit: string;
    };
    feed: {
      byAuthor: string;
      system: string;
      client: string;
      opportunity: string;
    };
    shared: {
      typeCall: string;
      typeEmail: string;
      typeMeeting: string;
      typeNote: string;
      typeTask: string;
      allTypes: string;
      allAuthors: string;
      allLeads: string;
      allClients: string;
      allOpportunities: string;
      inactiveSuffix: string;
      unknownDate: string;
      successCreated: string;
      generalActivity: string;
    };
    validation: {
      clientInvalid: string;
      descriptionRequired: string;
      descriptionMax: string;
      leadInvalid: string;
      opportunityInvalid: string;
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
