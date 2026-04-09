import { enMessages } from './en';
import { ptBRMessages } from './pt-BR';
import type { AppLocale, AppMessages } from './types';

export const DEFAULT_LOCALE: AppLocale = 'en';

export const appMessagesByLocale: Record<AppLocale, AppMessages> = {
  en: enMessages,
  'pt-BR': ptBRMessages,
};
