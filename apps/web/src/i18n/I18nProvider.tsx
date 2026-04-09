'use client';

import { createContext, useContext } from 'react';

import type { AppLocale, AppMessages } from './messages/types';

type I18nContextValue = Readonly<{
  locale: AppLocale;
  messages: AppMessages;
}>;

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = Readonly<{
  children: React.ReactNode;
  locale: AppLocale;
  messages: AppMessages;
}>;

export function I18nProvider({ children, locale, messages }: I18nProviderProps) {
  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider.');
  }

  return context;
}
