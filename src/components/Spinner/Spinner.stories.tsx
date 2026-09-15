import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Spinner> = {
  title: 'Display/Spinner',
  component: Spinner,
  args: { size: 'md', colorScheme: 'primary' },
  argTypes: {
    size: common.size(),
    colorScheme: common.colorScheme(),
    color: common.color('Explicit color; overrides colorScheme.'),
    label: common.text('Accessible label.', "'Loading'"),
    showLabel: common.bool('Show the label beneath.'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Spinner> = {};

export const Sizes: StoryObj = {
  parameters: {
    code: code`<HStack spacing={6} align="center">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner />
  <Spinner size="lg" />
  <Spinner size="xl" />
  <Spinner colorScheme="danger" showLabel label="Loading…" />
</HStack>`,
  },
};
