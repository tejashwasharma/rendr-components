import type { Theme } from './types';
import {
  borderWidths,
  breakpoints,
  durations,
  easing,
  fontSizes,
  fontWeights,
  fonts,
  glass,
  glassLightSemanticColors,
  lightSemanticColors,
  lineHeights,
  opacity,
  palette,
  radii,
  shadows,
  spacing,
  zIndices,
} from './tokens';

/** Default theme: light mode, glass **on**. */
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    palette,
    semantic: glassLightSemanticColors,
  },
  spacing,
  radii,
  fontSizes,
  fontWeights,
  lineHeights,
  fonts,
  shadows,
  zIndices,
  breakpoints,
  borderWidths,
  opacity,
  durations,
  easing,
  glass,
  components: {},
};

/** Light mode with glass **off**: white surfaces on an off-white ground, black text. */
export const solidLightTheme: Theme = {
  ...lightTheme,
  colors: { palette, semantic: lightSemanticColors },
  glass: { ...glass, enabled: false },
};

export const defaultTheme = lightTheme;
