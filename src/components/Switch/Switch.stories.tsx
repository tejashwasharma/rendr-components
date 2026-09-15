import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  args: { label: 'Notifications', defaultChecked: true, size: 'md', colorScheme: 'primary' },
  argTypes: {
    label: common.text('Label.'),
    defaultChecked: common.bool('Initial state (uncontrolled).'),
    checked: common.hidden,
    labelPlacement: { control: 'select', options: ['start', 'end'], table: { defaultValue: { summary: "'end'" } } },
    isDisabled: common.bool('Disabled.'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    onChange: common.fn('onChange'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Switch> = {};

export const Sizes: StoryObj = {
  parameters: {
    code: code`<HStack spacing={4}>
  <Switch size="xs" defaultChecked />
  <Switch size="sm" defaultChecked />
  <Switch size="md" defaultChecked />
  <Switch size="lg" defaultChecked colorScheme="success" />
  <Switch size="xl" defaultChecked colorScheme="danger" />
</HStack>`,
  },
};
