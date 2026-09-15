function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively merge `source` into a copy of `target`. Plain objects are merged
 * key by key; arrays and every other value are replaced. `undefined` values in
 * `source` are ignored so partial overrides never erase base values.
 */
export function deepMerge<T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S,
): T & S {
  const out: Record<string, any> = { ...target };
  for (const key of Object.keys(source)) {
    const s = (source as Record<string, any>)[key];
    if (s === undefined) continue;
    const t = out[key];
    out[key] = isPlainObject(t) && isPlainObject(s) ? deepMerge(t, s) : s;
  }
  return out as T & S;
}
