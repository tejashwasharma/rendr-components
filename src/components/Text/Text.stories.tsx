import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  args: { children: 'The quick brown fox jumps over the lazy dog.', size: 'md', color: 'text' },
  argTypes: {
    children: common.text('Text content.'),
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'], description: 'Font size token (or a number).', table: { defaultValue: { summary: "'md'" } } },
    weight: { control: 'select', options: ['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'], description: 'Font weight token.' },
    color: common.color('Text color.', "'text'"),
    align: { control: 'select', options: ['left', 'center', 'right'], description: 'textAlign.' },
    lineHeight: { control: 'select', options: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'], description: 'Line-height multiplier token.' },
    font: { control: 'select', options: ['body', 'heading', 'mono'], description: 'Font family key from `theme.fonts`.' },
    italic: common.bool('Italic.'),
    underline: common.bool('Underline.'),
    strikethrough: common.bool('Line-through.'),
    uppercase: common.bool('Uppercase transform.'),
    truncate: { control: 'number', description: 'Truncate after N lines (true = 1).' },
    letterSpacing: common.number('Letter spacing in px.'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Text> = {};

export const Sizes: StoryObj = {
  parameters: {
    code: code`<VStack spacing={2}>
  {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((s) => (
    <Text key={s} size={s}>{s} — Sphinx of black quartz, judge my vow</Text>
  ))}
</VStack>`,
  },
};

export const Styles: StoryObj = {
  parameters: {
    code: code`<VStack spacing={2}>
  <Text color="primary.600" weight="semibold">Primary semibold</Text>
  <Text color="textMuted">Muted</Text>
  <Text italic>Italic</Text>
  <Text underline>Underlined</Text>
  <Text strikethrough>Struck</Text>
  <Text uppercase letterSpacing={1} size="xs" weight="semibold">Overline</Text>
  <Text truncate w={200}>This is a long line that will be truncated with an ellipsis.</Text>
</VStack>`,
  },
};
