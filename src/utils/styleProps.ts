import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import type { Breakpoint, Theme } from '../theme/types';
import { resolveColor, resolveDimension, resolveRadius, resolveSpace } from './getToken';
import { resolveShadow } from './shadow';

export const BREAKPOINT_ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

/** A value that may vary by breakpoint: `[base, sm, md]` or `{ base, md }`. */
export type Responsive<T> = T | T[] | Partial<Record<Breakpoint, T>>;

type SpaceValue = Responsive<number | string>;
type SizeValue = Responsive<number | string>;
type ColorValue = Responsive<string>;

/**
 * Style props. Spacing props (`m`, `p`, `gap`…) map numbers to the theme
 * spacing scale (`p={4}` → 16px). Dimension props (`w`, `h`, `top`…) treat
 * numbers as raw pixels and strings as spacing keys or CSS values (`'50%'`).
 */
export interface StyleProps {
  m?: SpaceValue;
  mx?: SpaceValue;
  my?: SpaceValue;
  mt?: SpaceValue;
  mr?: SpaceValue;
  mb?: SpaceValue;
  ml?: SpaceValue;
  p?: SpaceValue;
  px?: SpaceValue;
  py?: SpaceValue;
  pt?: SpaceValue;
  pr?: SpaceValue;
  pb?: SpaceValue;
  pl?: SpaceValue;
  gap?: SpaceValue;
  rowGap?: SpaceValue;
  columnGap?: SpaceValue;

  w?: SizeValue;
  h?: SizeValue;
  minW?: SizeValue;
  maxW?: SizeValue;
  minH?: SizeValue;
  maxH?: SizeValue;

  bg?: ColorValue;
  borderColor?: ColorValue;
  borderWidth?: Responsive<number>;
  rounded?: Responsive<number | string>;
  shadow?: Responsive<string>;
  opacity?: Responsive<number>;

  display?: Responsive<'flex' | 'none'>;
  position?: Responsive<'absolute' | 'relative'>;
  top?: SizeValue;
  right?: SizeValue;
  bottom?: SizeValue;
  left?: SizeValue;
  zIndex?: Responsive<number>;
  overflow?: Responsive<'visible' | 'hidden' | 'scroll'>;

  flex?: Responsive<number>;
  flexGrow?: Responsive<number>;
  flexShrink?: Responsive<number>;
  flexBasis?: SizeValue;
  direction?: Responsive<ViewStyle['flexDirection']>;
  wrap?: Responsive<ViewStyle['flexWrap']>;
  align?: Responsive<ViewStyle['alignItems']>;
  alignSelf?: Responsive<ViewStyle['alignSelf']>;
  justify?: Responsive<ViewStyle['justifyContent']>;
}

export const STYLE_PROP_KEYS: (keyof StyleProps)[] = [
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'gap', 'rowGap', 'columnGap',
  'w', 'h', 'minW', 'maxW', 'minH', 'maxH',
  'bg', 'borderColor', 'borderWidth', 'rounded', 'shadow', 'opacity',
  'display', 'position', 'top', 'right', 'bottom', 'left', 'zIndex', 'overflow',
  'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'direction', 'wrap', 'align', 'alignSelf', 'justify',
];

const STYLE_PROP_SET = new Set<string>(STYLE_PROP_KEYS);

/** Pick the value for the current breakpoint from a responsive value. */
export function resolveResponsive<T>(value: Responsive<T> | undefined, breakpoint: Breakpoint): T | undefined {
  if (value === undefined || value === null) return undefined;
  const idx = BREAKPOINT_ORDER.indexOf(breakpoint);
  if (Array.isArray(value)) {
    for (let i = Math.min(idx, value.length - 1); i >= 0; i--) {
      if (value[i] !== undefined && value[i] !== null) return value[i] as T;
    }
    return undefined;
  }
  if (typeof value === 'object') {
    const obj = value as Partial<Record<Breakpoint, T>>;
    for (let i = idx; i >= 0; i--) {
      const v = obj[BREAKPOINT_ORDER[i]];
      if (v !== undefined) return v;
    }
    return undefined;
  }
  return value as T;
}

type Resolver = (theme: Theme, v: unknown) => unknown;
const space: Resolver = (t, v) => resolveSpace(t, v);
const color: Resolver = (t, v) => resolveColor(t, v);
const dim: Resolver = (t, v) => resolveDimension(t, v);
const raw: Resolver = (_t, v) => v;

const MAP: Record<keyof StyleProps, [keyof ViewStyle | (keyof ViewStyle)[], Resolver]> = {
  m: ['margin', space],
  mx: ['marginHorizontal', space],
  my: ['marginVertical', space],
  mt: ['marginTop', space],
  mr: ['marginRight', space],
  mb: ['marginBottom', space],
  ml: ['marginLeft', space],
  p: ['padding', space],
  px: ['paddingHorizontal', space],
  py: ['paddingVertical', space],
  pt: ['paddingTop', space],
  pr: ['paddingRight', space],
  pb: ['paddingBottom', space],
  pl: ['paddingLeft', space],
  gap: ['gap', space],
  rowGap: ['rowGap', space],
  columnGap: ['columnGap', space],
  w: ['width', dim],
  h: ['height', dim],
  minW: ['minWidth', dim],
  maxW: ['maxWidth', dim],
  minH: ['minHeight', dim],
  maxH: ['maxHeight', dim],
  bg: ['backgroundColor', color],
  borderColor: ['borderColor', color],
  borderWidth: ['borderWidth', raw],
  rounded: ['borderRadius', (t, v) => resolveRadius(t, v)],
  shadow: ['shadowColor', raw], // handled specially
  opacity: ['opacity', raw],
  display: ['display', raw],
  position: ['position', raw],
  top: ['top', dim],
  right: ['right', dim],
  bottom: ['bottom', dim],
  left: ['left', dim],
  zIndex: ['zIndex', raw],
  overflow: ['overflow', raw],
  flex: ['flex', raw],
  flexGrow: ['flexGrow', raw],
  flexShrink: ['flexShrink', raw],
  flexBasis: ['flexBasis', dim],
  direction: ['flexDirection', raw],
  wrap: ['flexWrap', raw],
  align: ['alignItems', raw],
  alignSelf: ['alignSelf', raw],
  justify: ['justifyContent', raw],
};

/**
 * Convert style props into a React Native style object, resolving theme
 * scales and responsive values for the current breakpoint.
 */
export function stylePropsToStyle(theme: Theme, props: StyleProps, breakpoint: Breakpoint): ViewStyle {
  const style: Record<string, unknown> = {};
  for (const key of STYLE_PROP_KEYS) {
    const value = resolveResponsive(props[key] as Responsive<unknown>, breakpoint);
    if (value === undefined) continue;
    if (key === 'shadow') {
      Object.assign(style, resolveShadow(theme, value));
      continue;
    }
    const [styleKey, resolve] = MAP[key];
    style[styleKey as string] = resolve(theme, value);
  }
  return style as ViewStyle;
}

/** Split props into `[styleProps, rest]`. */
export function splitStyleProps<P extends object>(props: P): [StyleProps, Omit<P, keyof StyleProps>] {
  const styleProps: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (STYLE_PROP_SET.has(key)) styleProps[key] = (props as Record<string, unknown>)[key];
    else rest[key] = (props as Record<string, unknown>)[key];
  }
  return [styleProps as StyleProps, rest as Omit<P, keyof StyleProps>];
}

export function useStyleProps<P extends object>(
  theme: Theme,
  breakpoint: Breakpoint,
  props: P,
): [ViewStyle, Omit<P, keyof StyleProps>] {
  const [styleProps, rest] = splitStyleProps(props);
  // Recompute only when a style prop value changes.
  const depKey = JSON.stringify(styleProps);
  const style = useMemo(
    () => stylePropsToStyle(theme, styleProps, breakpoint),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, breakpoint, depKey],
  );
  return [style, rest];
}
