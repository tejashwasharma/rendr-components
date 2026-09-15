import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  argTypes: {
    label: common.text('Tooltip content.'),
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'], table: { defaultValue: { summary: "'top'" } } },
    openDelay: common.number('Hover delay in ms (web).', 300),
    closeDelay: common.number('Close delay in ms.', 100),
    isDisabled: common.bool('Never shows.'),
    showOnPress: common.bool('Native: show on press instead of long-press.'),
  },
};
export default meta;

export const Placements: StoryObj = {
  parameters: {
    code: code`<HStack spacing={3}>
  {['top', 'bottom', 'left', 'right'].map((p) => (
    <Tooltip key={p} label={'Tooltip on ' + p} placement={p}>
      <Button variant="subtle" colorScheme="neutral">{p}</Button>
    </Tooltip>
  ))}
</HStack>`,
  },
};
