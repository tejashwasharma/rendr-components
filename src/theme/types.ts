import type {
  ColorScale,
  ShadowToken,
  borderWidths,
  breakpoints,
  durations,
  easing,
  fontSizes,
  glass,
  fontWeights,
  lightSemanticColors,
  lineHeights,
  opacity,
  palette,
  radii,
  spacing,
  zIndices,
} from './tokens';

/**
 * Augment this interface from your app to get typed autocomplete for custom
 * color schemes you add via `createTheme`:
 *
 * ```ts
 * declare module 'rendr-components' {
 *   interface RendrCustomColors { brand: true }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RendrCustomColors {}

export type BuiltInColorScheme = keyof typeof palette;
export type ColorScheme = BuiltInColorScheme | keyof RendrCustomColors | (string & {});

export type SemanticColors = typeof lightSemanticColors;

export interface ThemeColors {
  palette: Record<BuiltInColorScheme, ColorScale> & Record<string, ColorScale>;
  semantic: SemanticColors;
}

export type ThemeFonts = {
  body?: string;
  heading?: string;
  mono?: string;
};

/**
 * Per-component theme overrides. Each component reads `defaultProps` for its
 * fallback prop values and `variants` for extra, app-defined variants.
 */
export interface ComponentThemeConfig<Props = Record<string, unknown>, VariantStyle = Record<string, unknown>> {
  defaultProps?: Partial<Props>;
  variants?: Record<string, VariantStyle>;
}

export interface ThemeComponents {
  [componentName: string]: ComponentThemeConfig<any, any> | undefined;
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  fonts: ThemeFonts;
  shadows: Record<string, ShadowToken>;
  zIndices: typeof zIndices;
  breakpoints: typeof breakpoints;
  borderWidths: typeof borderWidths;
  opacity: typeof opacity;
  durations: typeof durations;
  easing: typeof easing;
  glass: typeof glass;
  components: ThemeComponents;
}

export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ThemeOverride = DeepPartial<Theme>;

export type ColorMode = 'light' | 'dark';
export type ColorModePreference = ColorMode | 'system';

export type SpacingToken = keyof typeof spacing;
export type RadiiToken = keyof typeof radii;
export type FontSizeToken = keyof typeof fontSizes;
export type FontWeightToken = keyof typeof fontWeights;
export type ShadowTokenName = 'none' | 'sm' | 'md' | 'lg' | 'xl' | (string & {});
export type Breakpoint = keyof typeof breakpoints;
