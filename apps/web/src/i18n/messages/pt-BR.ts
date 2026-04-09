import type { AppMessages } from './types';

export const ptBRMessages: AppMessages = {
  auth: {
    layout: {
      title: 'Times de vendas, com isolamento por tenant desde o inicio.',
      description:
        'Este workspace ja esta preparado para conectar o Next.js ao backend NestJS existente com autenticacao limpa, rotas protegidas e um shell privado que pode crescer modulo por modulo.',
      steps: [
        'Cadastre uma organizacao e crie a primeira conta owner.',
        'Entre no sistema e hidrate a sessao usando `/auth/me`.',
        'Acesse o shell privado e comece a evoluir os modulos do produto.',
      ],
    },
    loginPage: {
      title: 'Bem-vindo de volta',
      description:
        'Entre com a conta do owner ou de um membro do time ja cadastrado na sua organizacao.',
    },
    loginForm: {
      emailLabel: 'Email de trabalho',
      emailPlaceholder: 'voce@empresa.com',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Digite sua senha',
      submit: 'Entrar',
      submitting: 'Entrando...',
      switchPrompt: 'Novo no Pulse CRM?',
      switchLink: 'Crie seu workspace',
      fallbackError: 'Nao foi possivel entrar agora.',
    },
    logout: {
      submit: 'Sair',
      submitting: 'Saindo...',
      fallbackError:
        'Nao foi possivel confirmar o logout com a API, mas a sessao local foi encerrada.',
    },
    registerPage: {
      title: 'Crie seu workspace',
      description:
        'Crie o primeiro workspace da organizacao e a conta owner para comecar a usar o CRM.',
    },
    registerForm: {
      organizationNameLabel: 'Nome da organizacao',
      organizationNamePlaceholder: 'Northwind Sales',
      organizationSlugLabel: 'Slug da organizacao',
      organizationSlugPlaceholder: 'northwind-sales',
      organizationSlugHint: 'Opcional. Usado nas URLs do workspace e precisa ser unico.',
      nameLabel: 'Seu nome',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Email de trabalho',
      emailPlaceholder: 'alex@northwind.com',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Crie uma senha',
      passwordHint: 'No minimo 8 caracteres.',
      submit: 'Criar workspace',
      submitting: 'Criando workspace...',
      switchPrompt: 'Ja tem uma conta?',
      switchLink: 'Entrar',
      fallbackError: 'Nao foi possivel criar seu workspace agora.',
    },
    validation: {
      emailInvalid: 'Digite um endereco de email valido.',
      organizationNameMin: 'O nome da organizacao precisa ter pelo menos 2 caracteres.',
      organizationNameMax: 'O nome da organizacao pode ter no maximo 120 caracteres.',
      organizationSlugPattern: 'Use apenas letras minusculas, numeros e hifens.',
      organizationSlugMin: 'O slug precisa ter pelo menos 2 caracteres.',
      organizationSlugMax: 'O slug pode ter no maximo 80 caracteres.',
      nameMin: 'Seu nome precisa ter pelo menos 2 caracteres.',
      nameMax: 'Seu nome pode ter no maximo 120 caracteres.',
      passwordMin: 'A senha precisa ter pelo menos 8 caracteres.',
      passwordMax: 'A senha pode ter no maximo 72 caracteres.',
    },
  },
  common: {
    brand: 'Pulse CRM',
    loading: {
      title: 'Carregando seu CRM',
      description: 'Preparando seu workspace e os detalhes da sessao.',
      privateTitle: 'Abrindo workspace',
      privateDescription: 'Carregando a proxima tela do CRM e preparando os dados mais recentes.',
      authGuardTitle: 'Preparando seu workspace',
      authGuardDescription:
        'Estamos validando sua sessao e carregando o contexto mais recente da organizacao.',
    },
    actions: {
      close: 'Fechar',
      tryAgain: 'Tentar novamente',
      goToDashboard: 'Ir para o dashboard',
    },
  },
  errors: {
    notFound: {
      eyebrow: '404',
      title: 'Esta pagina nao existe.',
      description: 'A rota pode ter mudado ou a sessao pode ter redirecionado para outro lugar.',
      cta: 'Ir para o dashboard',
    },
  },
  roles: {
    OWNER: 'Owner',
    MANAGER: 'Manager',
    SALES_REP: 'Representante comercial',
  },
  shell: {
    mobileMenuOpen: 'Abrir menu',
    mobileMenuClose: 'Fechar menu',
    closeNavigationAriaLabel: 'Fechar menu de navegacao',
    signedInAs: 'Logado como',
    workspaceEyebrow: 'Workspace da organizacao',
    nav: {
      dashboard: {
        label: 'Dashboard',
        description: 'Visao geral e resumo de performance',
      },
      leads: {
        label: 'Leads',
        description: 'Pipeline de prospeccao e entrada',
      },
      clients: {
        label: 'Clientes',
        description: 'Registros e contas de clientes',
      },
      opportunities: {
        label: 'Oportunidades',
        description: 'Pipeline de receita e etapas',
      },
      activities: {
        label: 'Atividades',
        description: 'Tarefas, notas e follow-ups',
      },
      users: {
        label: 'Usuarios',
        description: 'Membros do time e permissoes',
      },
      settings: {
        label: 'Configuracoes',
        description: 'Workspace e configuracoes da organizacao',
      },
    },
  },
};
