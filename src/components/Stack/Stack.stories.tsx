import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    spacing: { control: 'text', description: 'Gap between children (spacing key). Default 2.' },
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'], description: 'Layout direction. HStack / VStack preset it.' },
    divider: { control: false, description: 'Element rendered between children.' },
    horizontal: { control: 'boolean', description: 'Shorthand for direction="row".' },
  },
};
export default meta;

export const Vertical: StoryObj = {
  parameters: {
    code: code`<VStack spacing={3}>
  <Box p={3} bg="primary.100" rounded="md"><Text>one</Text></Box>
  <Box p={3} bg="primary.100" rounded="md"><Text>two</Text></Box>
  <Box p={3} bg="primary.100" rounded="md"><Text>three</Text></Box>
</VStack>`,
  },
};

export const HorizontalWithDivider: StoryObj = {
  parameters: {
    code: code`<HStack spacing={3} divider={<Box w={1} h={24} bg="border" />}>
  <Text>one</Text>
  <Text>two</Text>
  <Text>three</Text>
</HStack>`,
  },
};
