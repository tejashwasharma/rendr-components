import type { Theme } from '../theme/types';

function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/**
 * Resolve a value against a theme scale. Accepts a scale key (`4`, `'md'`), a
 * dotted token path (`'primary.500'`, `'semantic.text'`) or a raw value, which
 * is returned unchanged when nothing matches.
 */
export function resolveScale<S extends Record<string, unknown>>(
  scale: S | undefined,
  value: unknown,
): unknown {
  if (value === undefined || value === null || !scale) return value;
  if ((typeof value === 'string' || typeof value === 'number') && value in scale) {
    return scale[value as keyof S];
  }
  return value;
}

/**
 * Resolve a color value. Supports:
 * - `'primary.500'` → palette shade
 * - `'primary'` → palette shade 500
 * - `'text'`, `'semantic.text'` → semantic color
 * - anything else (hex, rgba, named css color) → returned as-is
 */
export function resolveColor(theme: Theme, value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return String(value);

  const semantic = theme.colors.semantic as Record<string, string>;
  if (value.startsWith('semantic.')) return semantic[value.slice(9)] ?? value;
  if (value in semantic) return semantic[value];

  const [scheme, shade] = value.split('.');
  const scale = theme.colors.palette[scheme];
  if (scale) {
    if (shade === undefined) return scale[500];
    const s = (scale as unknown as Record<string, string>)[shade];
    if (s) return s;
  }
  return value;
}

/** Read any token by dotted path, e.g. `getToken(theme, 'colors.palette.primary.500')`. */
export function getToken(theme: Theme, path: string): unknown {
  return getPath(theme, path);
}

export function resolveSpace(theme: Theme, value: unknown): number | string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number' && value < 0) {
    const abs = resolveScale(theme.spacing as Record<string, unknown>, Math.abs(value));
    return typeof abs === 'number' ? -abs : (value as number);
  }
  return resolveScale(theme.spacing as Record<string, unknown>, value) as number | string;
}

export function resolveRadius(theme: Theme, value: unknown): number | undefined {
  return resolveScale(theme.radii as Record<string, unknown>, value) as number | undefined;
}

export function resolveFontSize(theme: Theme, value: unknown): number | undefined {
  return resolveScale(theme.fontSizes as Record<string, unknown>, value) as number | undefined;
}

export function resolveFontWeight(theme: Theme, value: unknown): string | undefined {
  const v = resolveScale(theme.fontWeights as Record<string, unknown>, value);
  return v === undefined ? undefined : String(v);
}

/**
 * Resolve a dimension (width/height/inset). Numbers are raw pixels; strings
 * are theme spacing keys (`'4'`, `'px'`) or raw CSS values (`'50%'`, `'100vh'`).
 */
export function resolveDimension(theme: Theme, value: unknown): number | string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return value;
  return resolveScale(theme.spacing as Record<string, unknown>, value) as number | string;
}
