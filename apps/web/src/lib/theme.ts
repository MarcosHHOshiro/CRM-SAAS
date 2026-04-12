export const THEME_COOKIE_NAME = 'pulse-theme';
export const THEME_STORAGE_KEY = 'pulse-theme';

export type ThemeMode = 'light' | 'dark';

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function getPreferredTheme(defaultTheme: ThemeMode = 'light'): ThemeMode {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (isThemeMode(storedTheme)) {
      return storedTheme;
    }
  } catch {}

  const cookieTheme = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${THEME_COOKIE_NAME}=`))
    ?.split('=')
    .slice(1)
    .join('=');

  if (isThemeMode(cookieTheme)) {
    return cookieTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : defaultTheme;
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  const rootElement = document.documentElement;

  rootElement.dataset.theme = theme;
  rootElement.style.colorScheme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}

  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function getThemeInitializationScript(defaultTheme: ThemeMode = 'light') {
  return `(() => {
    const storageKey = '${THEME_STORAGE_KEY}';
    const cookieName = '${THEME_COOKIE_NAME}';
    const fallbackTheme = '${defaultTheme}';
    const rootElement = document.documentElement;

    const isThemeMode = (value) => value === 'light' || value === 'dark';

    let resolvedTheme = null;

    try {
      const storedTheme = window.localStorage.getItem(storageKey);

      if (isThemeMode(storedTheme)) {
        resolvedTheme = storedTheme;
      }
    } catch {}

    if (!resolvedTheme) {
      const cookieTheme = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(cookieName + '='))
        ?.split('=')
        .slice(1)
        .join('=');

      if (isThemeMode(cookieTheme)) {
        resolvedTheme = cookieTheme;
      }
    }

    if (!resolvedTheme) {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : fallbackTheme;
    }

    rootElement.dataset.theme = resolvedTheme;
    rootElement.style.colorScheme = resolvedTheme;
  })();`;
}
