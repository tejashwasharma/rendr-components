import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof IconButton> = {
  title: 'Forms/IconButton',
  component: IconButton,
  argTypes: {
    icon: common.node('The icon element (required).'),
    accessibilityLabel: common.text('Screen-reader label (required).'),
    isRound: common.bool('Circular shape.'),
    variant: common.variant(['solid', 'outline', 'ghost', 'link', 'subtle'], 'solid'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    isDisabled: common.bool('Disabled.'),
    isLoading: common.bool('Loading.'),
  },
};
export default meta;

export const Examples: StoryObj = {
  parameters: {
    code: code`<HStack spacing={2}>
  <IconButton accessibilityLabel="Star" icon={<Text color="white">★</Text>} />
  <IconButton accessibilityLabel="Star" isRound variant="subtle" icon={<Text color="primary.700">★</Text>} />
  <IconButton accessibilityLabel="Close" variant="ghost" colorScheme="neutral" icon={<Text size="lg">×</Text>} />
  <IconButton accessibilityLabel="Delete" size="sm" colorScheme="danger" variant="outline" icon={<Text color="danger.600">✕</Text>} />
</HStack>`,
  },
};
