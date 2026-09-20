/**
 * Design tokens.
 *
 * Everything in this file is plain, serializable data (strings and numbers only)
 * so the token set can be exported to JSON for design tools or other platforms.
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export const palette = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} satisfies Record<string, ColorScale>;

/**
 * Semantic colors come in four sets: solid/glass × light/dark. `ThemeProvider`
 * picks the set for the active mode and glass switch.
 */
export const lightSemanticColors = {
  bg: '#f5f6f8',
  bgSubtle: '#eef0f3',
  surface: '#ffffff',
  surfaceSubtle: '#f1f3f6',
  surfaceHover: '#f1f3f6',
  surfaceActive: '#e3e6ec',
  field: '#ffffff',
  text: '#0f1219',
  textMuted: '#626a78',
  textInverse: '#ffffff',
  border: '#e3e6ec',
  borderStrong: '#cfd4dd',
  /** Lit edge (top/left) and shaded edge (bottom/right) of a sheet's rim. Transparent = no rim. */
  rimStart: 'transparent',
  rimEnd: 'transparent',
  overlay: 'rgba(15, 18, 25, 0.45)',
  focusRing: '#6366f1',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export type SemanticColorSet = typeof lightSemanticColors;

export const darkSemanticColors: SemanticColorSet = {
  bg: '#0f172a',
  bgSubtle: '#162032',
  surface: '#1e293b',
  surfaceSubtle: '#162032',
  surfaceHover: '#334155',
  surfaceActive: '#475569',
  field: '#0f172a',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textInverse: '#0f172a',
  border: '#334155',
  borderStrong: '#475569',
  rimStart: 'transparent',
  rimEnd: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.6)',
  focusRing: '#818cf8',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

/** Glass · light: white frosted sheets over a cool off-white ground. */
export const glassLightSemanticColors: SemanticColorSet = {
  bg: '#eceef4',
  bgSubtle: '#e4e7ef',
  surface: 'rgba(255, 255, 255, 0.46)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.28)',
  surfaceHover: 'rgba(255, 255, 255, 0.62)',
  surfaceActive: 'rgba(255, 255, 255, 0.75)',
  field: 'rgba(255, 255, 255, 0.38)',
  text: '#0f1219',
  textMuted: '#626a78',
  textInverse: '#ffffff',
  border: 'rgba(255, 255, 255, 0.55)',
  borderStrong: 'rgba(255, 255, 255, 0.85)',
  rimStart: 'rgba(255, 255, 255, 0.95)',
  rimEnd: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(40, 44, 70, 0.28)',
  focusRing: '#6366f1',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

/** Glass · dark: black frosted sheets over a near-black ground. */
export const glassDarkSemanticColors: SemanticColorSet = {
  bg: '#07080d',
  bgSubtle: '#0d0f16',
  surface: 'rgba(12, 14, 22, 0.52)',
  surfaceSubtle: 'rgba(12, 14, 22, 0.36)',
  surfaceHover: 'rgba(255, 255, 255, 0.08)',
  surfaceActive: 'rgba(255, 255, 255, 0.14)',
  field: 'rgba(0, 0, 0, 0.28)',
  text: '#f8fafc',
  textMuted: '#9aa3b2',
  textInverse: '#0f1219',
  border: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.24)',
  rimStart: 'rgba(255, 255, 255, 0.45)',
  rimEnd: 'rgba(0, 0, 0, 0.25)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  focusRing: '#818cf8',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

/** The semantic colour set for a mode + glass combination. */
export function semanticFor(mode: 'light' | 'dark', glass: boolean): SemanticColorSet {
  if (glass) return mode === 'dark' ? glassDarkSemanticColors : glassLightSemanticColors;
  return mode === 'dark' ? darkSemanticColors : lightSemanticColors;
}

/** Ambient colour the glass shows through (used by Storybook / demos; apps paint their own). */
export const glassAmbient = {
  a: '#6366f1',
  b: '#f0647a',
  c: '#10b981',
};

export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

export const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const fonts = {
  body: undefined as string | undefined,
  heading: undefined as string | undefined,
  mono: undefined as string | undefined,
};

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  /** Android */
  elevation: number;
}

export const shadows: Record<'none' | 'sm' | 'md' | 'lg' | 'xl', ShadowToken> = {
  none: { shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  sm: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: '#000000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  xl: { shadowColor: '#000000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.16, shadowRadius: 28, elevation: 14 },
};

export const zIndices = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1700,
  tooltip: 1800,
};

/** Min widths in px. */
export const breakpoints = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const borderWidths = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 4,
};

export const opacity = {
  disabled: 0.5,
  pressed: 0.8,
};

/** Motion. `fast`: hover/press · `normal`: open/close & selection pill · `theme`: glass/mode switch. */
export const durations = {
  fast: 140,
  normal: 240,
  slow: 320,
  theme: 420,
};

/** CSS easing used on web; native uses Easing.bezier with the same numbers. */
export const easing = {
  standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  bezier: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
};

/** Glass surface settings. `enabled` is flipped by `<ThemeProvider glass>`. */
export const glass = {
  enabled: true,
  /** Backdrop blur radius in px. */
  blur: 3,
  /** Web only: backdrop-filter saturate(). */
  saturate: 1.4,
  /** Draw the lit-edge rim on sheets. */
  rim: true,
  /** Blur strength for the modal backdrop, as a fraction of `blur`. */
  overlayBlur: 0.25,
};

/** Shadows used by glass sheets (softer, with an inset highlight on web). */
export const glassShadows: Record<'light' | 'dark', { sm: ShadowToken; md: ShadowToken; lg: ShadowToken }> = {
  light: {
    sm: { shadowColor: '#141a3c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
    md: { shadowColor: '#141a3c', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 20, elevation: 6 },
    lg: { shadowColor: '#141a3c', shadowOffset: { width: 0, height: 30 }, shadowOpacity: 0.28, shadowRadius: 40, elevation: 12 },
  },
  dark: {
    sm: { shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 2 },
    md: { shadowColor: '#000000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.55, shadowRadius: 22, elevation: 6 },
    lg: { shadowColor: '#000000', shadowOffset: { width: 0, height: 30 }, shadowOpacity: 0.7, shadowRadius: 48, elevation: 12 },
  },
};
