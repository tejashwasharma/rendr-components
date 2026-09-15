import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from './Surface';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Surface> = {
  title: 'Layout/Surface',
  component: Surface,
  parameters: { docs: { description: { component: 'The glass recipe lives here. Card, Modal, Menu, Select, Toast, Tooltip, Tabs and Table all render through it. Use the Glass toolbar toggle to compare.' } } },
  args: { variant: 'sheet', rounded: 'lg', shadow: 'md', p: 5, children: 'Surface' },
  argTypes: {
    variant: common.variant(['sheet', 'subtle', 'field', 'plain'], 'sheet'),
    rounded: common.rounded('lg'),
    shadow: { control: 'select', options: ['none', 'sm', 'md', 'lg'], table: { defaultValue: { summary: "'md' for sheets" } } },
    glass: common.bool('Override the provider switch for this surface.'),
    rim: common.bool('Lit-edge rim (glass only).', true),
    bordered: common.bool('1px border.', true),
    blur: common.number('Backdrop blur px.', 24),
  },
};
export default meta;

export const Playground: StoryObj<typeof Surface> = {
  parameters: { code: (a: Record<string, unknown>) => code`<Surface variant="${a.variant}" rounded="${a.rounded}" shadow="${a.shadow}" p={5}>
  <Text>${a.children}</Text>
</Surface>` },
};

export const Variants: StoryObj = {
  parameters: {
    code: code`<VStack spacing={4}>
  <Surface p={4}><Text weight="semibold">sheet</Text><Text size="sm" color="textMuted">Card-like: fill, blur, rim, shadow.</Text></Surface>
  <Surface variant="subtle" p={4}><Text weight="semibold">subtle</Text><Text size="sm" color="textMuted">Quieter inset — tab lists, table heads.</Text></Surface>
  <Surface variant="field" p={4}><Text weight="semibold">field</Text><Text size="sm" color="textMuted">Inputs and outline buttons.</Text></Surface>
  <Surface variant="plain" p={4}><Text weight="semibold">plain</Text><Text size="sm" color="textMuted">Frame only, no fill.</Text></Surface>
  <Surface glass={false} p={4}><Text weight="semibold">glass={'{false}'}</Text><Text size="sm" color="textMuted">Opted out of glass for this one surface.</Text></Surface>
</VStack>`,
  },
};
