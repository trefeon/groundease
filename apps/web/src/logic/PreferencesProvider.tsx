import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  PreferencesContext,
  readPreferences,
  writePreferences,
} from '@/logic/preferences';
import type { PreferencesContextValue, UserPreferences } from '@/logic/preferences';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => readPreferences());
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme());
  const resolvedTheme = preferences.theme === 'system' ? systemTheme : preferences.theme;

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light');

    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'dark' ? '#17241d' : '#f8faf7');
    writePreferences(preferences);
  }, [preferences, resolvedTheme]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      resolvedTheme,
      setPreference: (key, nextValue) => {
        setPreferences((current) => ({ ...current, [key]: nextValue }));
      },
    }),
    [preferences, resolvedTheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
