import type { Theme, ThemeOverride } from './types';
import { darkSemanticColors, glassDarkSemanticColors } from './tokens';
import { lightTheme } from './lightTheme';
import { deepMerge } from '../utils/deepMerge';

/** Overrides applied on top of the light theme to produce the (glass) dark theme. */
export const darkThemeOverrides: ThemeOverride = {
  mode: 'dark',
  colors: {
    semantic: glassDarkSemanticColors,
  },
};

/** Dark mode, glass **on**. */
export const darkTheme: Theme = deepMerge(lightTheme, darkThemeOverrides) as Theme;

/** Dark mode with glass **off**: the slate dark palette. */
export const solidDarkTheme: Theme = deepMerge(lightTheme, {
  mode: 'dark',
  colors: { semantic: darkSemanticColors },
  glass: { enabled: false },
}) as Theme;
