import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Badge> = {
  title: 'Display/Badge',
  component: Badge,
  args: { children: 'New', variant: 'subtle', colorScheme: 'primary', size: 'sm' },
  argTypes: {
    children: common.text('Label.'),
    variant: common.variant(['subtle', 'solid', 'outline'], 'subtle'),
    colorScheme: common.colorScheme('neutral'),
    size: common.size(['xs', 'sm', 'md', 'lg'], 'sm'),
    rounded: common.rounded('sm'),
    uppercase: common.bool('Uppercase label.', true),
  },
};
export default meta;

export const Playground: StoryObj<typeof Badge> = {};

export const AllVariants: StoryObj = {
  parameters: {
    code: code`<VStack spacing={3}>
  {['subtle', 'solid', 'outline'].map((v) => (
    <HStack key={v} spacing={2} wrap="wrap">
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map((c) => (
        <Badge key={c} variant={v} colorScheme={c}>{c}</Badge>
      ))}
    </HStack>
  ))}
  <HStack spacing={2}>
    <Badge rounded="full" variant="solid" size="md">Pill</Badge>
    <Badge size="lg" uppercase={false}>Not uppercase</Badge>
  </HStack>
</VStack>`,
  },
};
