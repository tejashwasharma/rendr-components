import type { Theme, ThemeOverride } from './types';
import { lightTheme } from './lightTheme';
import { deepMerge } from '../utils/deepMerge';

/**
 * Create a theme by deep-merging partial overrides on top of a base theme
 * (the built-in light theme by default). Any subset can be overridden — a
 * single palette shade, a whole color scheme, spacing, fonts, or brand-new
 * color schemes that become available as `colorScheme="..."` everywhere.
 */
export function createTheme(overrides: ThemeOverride = {}, base: Theme = lightTheme): Theme {
  return deepMerge(base, overrides) as Theme;
}

export function isTheme(value: unknown): value is Theme {
  return (
    !!value &&
    typeof value === 'object' &&
    'colors' in (value as Record<string, unknown>) &&
    'spacing' in (value as Record<string, unknown>)
  );
}
