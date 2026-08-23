import { createContext, useContext } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type AmbientSoundPreference = 'none' | 'rain' | 'ocean' | 'forest' | 'singing-bowls' | 'river';

export type UserPreferences = {
  dailyReminder: boolean;
  theme: ThemePreference;
  ambientSound: AmbientSoundPreference;
  ambientMuted: boolean;
  ambientVolume: number;
};

export type PreferencesContextValue = {
  preferences: UserPreferences;
  resolvedTheme: 'light' | 'dark';
  setPreference: <Key extends keyof UserPreferences>(
    key: Key,
    value: UserPreferences[Key],
  ) => void;
};

export const preferencesStorageKey = 'ruang-pulih:preferences';

export const defaultPreferences: UserPreferences = {
  dailyReminder: true,
  theme: 'system',
  ambientSound: 'none',
  ambientMuted: false,
  ambientVolume: 35,
};

export const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Terang' },
  { value: 'dark', label: 'Gelap' },
];

export const ambientSoundOptions: { value: AmbientSoundPreference; label: string }[] = [
  { value: 'none', label: 'Tanpa suara' },
  { value: 'forest', label: 'Alam' },
  { value: 'rain', label: 'Hujan ringan' },
  { value: 'ocean', label: 'Ombak pantai' },
  { value: 'river', label: 'Sungai' },
  { value: 'singing-bowls', label: 'Genta' },
];

export const ambientSoundSources: Record<
  Exclude<AmbientSoundPreference, 'none'>,
  { ogg: string; mp3: string }
> = {
  rain: { ogg: '/audio/rain-loop.ogg', mp3: '/audio/rain-loop.mp3' },
  ocean: { ogg: '/audio/ocean-loop.ogg', mp3: '/audio/ocean-loop.mp3' },
  forest: { ogg: '/audio/wind-loop.ogg', mp3: '/audio/wind-loop.mp3' },
  river: { ogg: '/audio/river-loop.ogg', mp3: '/audio/river-loop.mp3' },
  'singing-bowls': { ogg: '/audio/singing-bowls-loop.ogg', mp3: '/audio/singing-bowls-loop.mp3' },
};

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

function isAmbientSoundPreference(value: unknown): value is AmbientSoundPreference {
  return value === 'none' || value === 'rain' || value === 'ocean' || value === 'forest' || value === 'singing-bowls' || value === 'river';
}

function normalizeAmbientSound(value: unknown): AmbientSoundPreference {
  if (value === 'white-noise' || value === 'wind') return 'forest';
  return isAmbientSoundPreference(value) ? value : defaultPreferences.ambientSound;
}

function normalizeVolume(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return defaultPreferences.ambientVolume;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function readPreferences(): UserPreferences {
  try {
    const raw = window.localStorage.getItem(preferencesStorageKey);
    if (!raw) return defaultPreferences;

    const parsed = JSON.parse(raw) as Partial<UserPreferences> & {
      ambientSound?: unknown;
      theme?: unknown;
    };

    return {
      dailyReminder:
        typeof parsed.dailyReminder === 'boolean'
          ? parsed.dailyReminder
          : defaultPreferences.dailyReminder,
      theme: isThemePreference(parsed.theme) ? parsed.theme : defaultPreferences.theme,
      ambientSound: normalizeAmbientSound(parsed.ambientSound),
      ambientMuted:
        typeof parsed.ambientMuted === 'boolean'
          ? parsed.ambientMuted
          : defaultPreferences.ambientMuted,
      ambientVolume: normalizeVolume(parsed.ambientVolume),
    };
  } catch {
    return defaultPreferences;
  }
}

export function writePreferences(preferences: UserPreferences) {
  window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }

  return context;
}
