/**
 * Groundease Spacing System
 * Base unit: 4px
 * All spacing values follow the 4px scale.
 * Use these tokens instead of hardcoded pixel values.
 */

export const spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  '2xl': 24,
  /** 32px */
  '3xl': 32,
  /** 40px */
  '4xl': 40,
  /** 48px */
  '5xl': 48,
  /** 64px */
  '6xl': 64,
  /** 80px */
  '7xl': 80,
  /** 96px */
  '8xl': 96,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Tailwind class mappings for spacing tokens.
 * Utility: given a token name, returns the Tailwind class string.
 * Example: space('lg') => 'p-4', gap('xl') => 'gap-5', etc.
 */
export function px(token: SpacingToken): number {
  return spacing[token];
}

/** Get Tailwind padding class for a spacing token */
export function p(token: SpacingToken): string {
  const map: Record<SpacingToken, string> = {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5',
    '2xl': 'p-6',
    '3xl': 'p-8',
    '4xl': 'p-10',
    '5xl': 'p-12',
    '6xl': 'p-16',
    '7xl': 'p-20',
    '8xl': 'p-24',
  };
  return map[token];
}

/** Get Tailwind gap class for a spacing token */
export function gap(token: SpacingToken): string {
  const map: Record<SpacingToken, string> = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5',
    '2xl': 'gap-6',
    '3xl': 'gap-8',
    '4xl': 'gap-10',
    '5xl': 'gap-12',
    '6xl': 'gap-16',
    '7xl': 'gap-20',
    '8xl': 'gap-24',
  };
  return map[token];
}