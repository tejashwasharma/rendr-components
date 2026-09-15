import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  args: { label: 'Accept terms', defaultChecked: true, size: 'md', colorScheme: 'primary' },
  argTypes: {
    label: common.text('Label to the right.'),
    defaultChecked: common.bool('Initial state (uncontrolled).'),
    checked: common.hidden,
    isIndeterminate: common.bool('Visual “mixed” state.'),
    isDisabled: common.bool('Disabled.'),
    isInvalid: common.bool('Danger border.'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    onChange: common.fn('onChange'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Checkbox> = {};

export const SelectAll: StoryObj = {
  parameters: {
    code: code`() => {
  const [items, setItems] = useState([true, false, true]);
  const all = items.every(Boolean);
  const some = items.some(Boolean) && !all;
  return (
    <VStack spacing={2}>
      <Checkbox label="Select all" checked={all} isIndeterminate={some} onChange={(v) => setItems(items.map(() => v))} />
      {items.map((v, i) => (
        <Checkbox key={i} ml={6} label={'Item ' + (i + 1)} checked={v} onChange={(nv) => setItems(items.map((x, j) => (j === i ? nv : x)))} />
      ))}
    </VStack>
  );
}`,
  },
};
