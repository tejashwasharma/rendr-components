import type { Theme } from '../theme/types';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'solid' | 'outline' | 'ghost' | 'link' | 'subtle';

export const SIZES: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];
export const VARIANTS: Variant[] = ['solid', 'outline', 'ghost', 'link', 'subtle'];

/**
 * Read component-level overrides from `theme.components[name]`, merging the
 * theme's `defaultProps` beneath the props actually passed.
 */
export function useComponentDefaults<P extends object>(theme: Theme, name: string, props: P): P {
  const config = theme.components?.[name];
  if (!config?.defaultProps) return props;
  const merged: Record<string, unknown> = { ...config.defaultProps };
  for (const key of Object.keys(props)) {
    const v = (props as Record<string, unknown>)[key];
    if (v !== undefined) merged[key] = v;
  }
  return merged as P;
}

/** Look up an app-defined variant from `theme.components[name].variants`. */
export function getThemeVariant<V = Record<string, unknown>>(
  theme: Theme,
  name: string,
  variant: string | undefined,
): V | undefined {
  if (!variant) return undefined;
  return theme.components?.[name]?.variants?.[variant] as V | undefined;
}

export interface VariantColors {
  bg: string;
  bgHover: string;
  bgPressed: string;
  text: string;
  border: string;
}

export interface InteractiveState {
  hovered?: boolean;
  pressed?: boolean;
}

/**
 * Resolve the colors for a `variant` × `colorScheme` pair in a theme-aware
 * way. Used by Button, Badge, Tab, Menu items and friends so that every
 * component reacts identically to a color scheme, including custom ones.
 */
export function getVariantColors(theme: Theme, scheme: string, variant: Variant): VariantColors {
  const scale = theme.colors.palette[scheme] ?? theme.colors.palette.primary;
  const { semantic } = theme.colors;
  const dark = theme.mode === 'dark';
  const transparent = semantic.transparent;

  switch (variant) {
    case 'solid':
      return {
        bg: scale[dark ? 500 : 600],
        bgHover: scale[dark ? 400 : 700],
        bgPressed: scale[dark ? 300 : 800],
        text: semantic.white,
        border: transparent,
      };
    case 'outline':
      return {
        bg: transparent,
        bgHover: dark ? scale[900] : scale[50],
        bgPressed: dark ? scale[800] : scale[100],
        text: scale[dark ? 300 : 600],
        border: scale[dark ? 400 : 500],
      };
    case 'subtle':
      return {
        bg: dark ? scale[900] : scale[100],
        bgHover: dark ? scale[800] : scale[200],
        bgPressed: dark ? scale[700] : scale[300],
        text: scale[dark ? 200 : 700],
        border: transparent,
      };
    case 'link':
      return {
        bg: transparent,
        bgHover: transparent,
        bgPressed: transparent,
        text: scale[dark ? 300 : 600],
        border: transparent,
      };
    case 'ghost':
    default:
      return {
        bg: transparent,
        bgHover: dark ? scale[900] : scale[50],
        bgPressed: dark ? scale[800] : scale[100],
        text: scale[dark ? 300 : 600],
        border: transparent,
      };
  }
}

/** Pick the background for the current interaction state. */
export function stateBg(colors: VariantColors, state: InteractiveState): string {
  if (state.pressed) return colors.bgPressed;
  if (state.hovered) return colors.bgHover;
  return colors.bg;
}
