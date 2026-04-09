import { cookies } from 'next/headers';

import { appMessagesByLocale, DEFAULT_LOCALE } from './messages';
import type { AppLocale } from './messages/types';

const localeAliases: Record<string, AppLocale> = {
  en: 'en',
  'en-us': 'en',
  pt: 'pt-BR',
  'pt-br': 'pt-BR',
};

function normalizeLocale(value: string) {
  return value.trim().toLowerCase();
}

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;

  if (!cookieLocale) {
    return DEFAULT_LOCALE;
  }

  const normalizedLocale = normalizeLocale(cookieLocale);
  const matchedLocale = localeAliases[normalizedLocale];

  if (matchedLocale) {
    return matchedLocale;
  }

  const baseLocale = normalizedLocale.split('-')[0];

  if (!baseLocale) {
    return DEFAULT_LOCALE;
  }

  const matchedBaseLocale = localeAliases[baseLocale];

  if (matchedBaseLocale) {
    return matchedBaseLocale;
  }

  return DEFAULT_LOCALE;
}

export async function getRequestI18n() {
  const locale = await getRequestLocale();

  return {
    locale,
    messages: appMessagesByLocale[locale],
  };
}
