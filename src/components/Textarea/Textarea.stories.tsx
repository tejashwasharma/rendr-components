import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { common } from '../../../.storybook/argTypes';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  args: { placeholder: 'Type several lines…', minRows: 3 },
  argTypes: {
    placeholder: common.text('Placeholder.'),
    minRows: common.number('Minimum visible rows.', 3),
    maxRows: common.number('Rows before it scrolls.'),
    autoGrow: common.bool('Grow with content.', true),
    variant: common.variant(['outline', 'filled', 'flushed', 'unstyled'], 'outline'),
    size: common.size(),
    isInvalid: common.bool('Danger border.'),
    isDisabled: common.bool('Disabled.'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Textarea> = {};
export const Bounded: StoryObj<typeof Textarea> = { args: { minRows: 2, maxRows: 5, placeholder: 'Grows from 2 to 5 rows' } };
