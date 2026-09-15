/**
 * Generate a component-only JSX snippet from a story's args, e.g.
 * `<Button variant="outline" size="lg">Save</Button>`.
 */
export function codeFromArgs(componentName: string, args: Record<string, unknown>): string {
  const { children, ...rest } = args;
  const attrs = Object.entries(rest)
    .filter(([, v]) => v !== undefined && v !== false && typeof v !== 'function')
    .map(([k, v]) => {
      if (v === true) return k;
      if (typeof v === 'string') return `${k}="${v.replace(/"/g, '\\"')}"`;
      if (typeof v === 'number') return `${k}={${v}}`;
      return `${k}={${JSON.stringify(v)}}`;
    });
  const open = `<${componentName}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  if (children === undefined || children === null || children === '') return `${open} />`;
  const inner = typeof children === 'string' ? children : `{${JSON.stringify(children)}}`;
  const multiline = attrs.length > 3;
  return multiline ? `${open}\n>\n  ${inner}\n</${componentName}>` : `${open}>${inner}</${componentName}>`;
}

/** Names of library components referenced in a snippet, for the import line. */
export function importLineFor(code: string, exported: Set<string>): string {
  const found = new Set<string>();
  for (const m of code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) if (exported.has(m[1])) found.add(m[1]);
  for (const m of code.matchAll(/\b(use[A-Z][A-Za-z]*|createTheme|ThemeProvider|ToastProvider)\b/g)) if (exported.has(m[1])) found.add(m[1]);
  if (!found.size) return '';
  return `import { ${[...found].sort().join(', ')} } from 'rendr-components';`;
}
