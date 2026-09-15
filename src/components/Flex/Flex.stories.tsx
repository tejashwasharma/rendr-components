import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from './Flex';
import { code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  argTypes: {
    center: { control: 'boolean', description: 'Shortcut for align="center" + justify="center".' },
    inline: { control: 'boolean', description: 'Row direction (default true).' },
    justify: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
    align: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch'] },
    gap: { control: 'text', description: 'Spacing key.' },
  },
};
export default meta;

export const SpaceBetween: StoryObj = {
  parameters: {
    code: code`<Flex justify="space-between" align="center" p={3} bg="bgSubtle" rounded="md">
  <Text>Left</Text>
  <Badge>Right</Badge>
</Flex>`,
  },
};

export const Centered: StoryObj = {
  parameters: {
    code: code`<Flex center h={100} bg="secondary.100" rounded="md">
  <Text color="secondary.800">Centered content</Text>
</Flex>`,
  },
};
