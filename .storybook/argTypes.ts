import type { InputType } from 'storybook/internal/types';

/** Reusable argTypes with descriptions, shown in the Controls (props) panel. */
export const common = {
  variant: (options: string[], def: string): InputType => ({
    control: 'select',
    options,
    description: 'Visual style. Custom variants can be added via `theme.components.<Name>.variants`.',
    table: { type: { summary: options.map((o) => `'${o}'`).join(' | ') }, defaultValue: { summary: `'${def}'` } },
  }),
  size: (options: string[] = ['xs', 'sm', 'md', 'lg', 'xl'], def = 'md'): InputType => ({
    control: 'select',
    options,
    description: 'Size preset.',
    table: { type: { summary: options.map((o) => `'${o}'`).join(' | ') }, defaultValue: { summary: `'${def}'` } },
  }),
  colorScheme: (def = 'primary'): InputType => ({
    control: 'select',
    options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    description: 'Palette color scheme. Any key in `theme.colors.palette`, including custom ones added with `createTheme`.',
    table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: `'${def}'` } },
  }),
  rounded: (def = 'md'): InputType => ({
    control: 'select',
    options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
    description: 'Border radius token from `theme.radii`, or a number.',
    table: { type: { summary: 'RadiiToken | number' }, defaultValue: { summary: `'${def}'` } },
  }),
  bool: (description: string, def = false): InputType => ({
    control: 'boolean',
    description,
    table: { type: { summary: 'boolean' }, defaultValue: { summary: String(def) } },
  }),
  text: (description: string, def?: string): InputType => ({
    control: 'text',
    description,
    table: { type: { summary: 'string' }, ...(def !== undefined ? { defaultValue: { summary: def } } : {}) },
  }),
  number: (description: string, def?: number): InputType => ({
    control: 'number',
    description,
    table: { type: { summary: 'number' }, ...(def !== undefined ? { defaultValue: { summary: String(def) } } : {}) },
  }),
  color: (description: string, def?: string): InputType => ({
    control: 'text',
    description: `${description} Accepts a palette token (\`'primary.500'\`), a semantic token (\`'textMuted'\`) or a raw color.`,
    table: { type: { summary: 'string' }, ...(def !== undefined ? { defaultValue: { summary: def } } : {}) },
  }),
  space: (description: string, def?: string): InputType => ({
    control: 'text',
    description: `${description} Numbers map to \`theme.spacing\` (4 → 16px); strings are raw CSS.`,
    table: { type: { summary: 'spacing key | string' }, ...(def !== undefined ? { defaultValue: { summary: def } } : {}) },
  }),
  node: (description: string): InputType => ({ control: false, description, table: { type: { summary: 'ReactNode' } } }),
  fn: (description: string): InputType => ({ control: false, action: description, description, table: { type: { summary: 'function' } } }),
  hidden: { table: { disable: true } } as InputType,
};

/** Tag helper so snippets read like JSX in story files. */
export const code = (strings: TemplateStringsArray, ...values: unknown[]) =>
  strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ''), '').trim();
