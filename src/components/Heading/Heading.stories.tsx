import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  args: { children: 'Heading', level: 2 },
  argTypes: {
    children: common.text('Heading text.'),
    level: { control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Semantic level; drives default size and a11y.', table: { defaultValue: { summary: '2' } } },
    size: { control: 'select', options: ['md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'], description: 'Override the size derived from level.' },
    weight: { control: 'select', options: ['medium', 'semibold', 'bold', 'extrabold'], table: { defaultValue: { summary: "'bold'" } } },
    color: common.color('Text color.'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Heading> = {};

export const AllLevels: StoryObj = {
  parameters: {
    code: code`<VStack spacing={2}>
  {[1, 2, 3, 4, 5, 6].map((l) => <Heading key={l} level={l}>Heading level {l}</Heading>)}
</VStack>`,
  },
};
