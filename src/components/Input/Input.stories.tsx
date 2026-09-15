import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  args: { placeholder: 'Type here…', variant: 'outline', size: 'md' },
  argTypes: {
    placeholder: common.text('Placeholder.'),
    variant: common.variant(['outline', 'filled', 'flushed', 'unstyled'], 'outline'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    rounded: common.rounded(),
    isInvalid: common.bool('Danger border. Inherited from FormField if omitted.'),
    isDisabled: common.bool('Not editable, dimmed.'),
    isReadOnly: common.bool('Not editable.'),
    isFullWidth: common.bool('Stretch to container width.', true),
    leftElement: common.node('Element inside the field on the left.'),
    rightElement: common.node('Element inside the field on the right.'),
    onChangeText: common.fn('onChangeText'),
    secureTextEntry: common.bool('Password entry.'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Input> = {};

export const Variants: StoryObj = {
  parameters: {
    code: code`<VStack spacing={3}>
  <Input placeholder="outline" />
  <Input placeholder="filled" variant="filled" />
  <Input placeholder="flushed" variant="flushed" />
  <Input placeholder="invalid" isInvalid />
  <Input placeholder="disabled" isDisabled />
  <Input placeholder="with elements" leftElement={<Text color="textMuted">@</Text>} rightElement={<Text color="textMuted">.com</Text>} />
</VStack>`,
  },
};

export const Controlled: StoryObj = {
  parameters: {
    code: code`() => {
  const [value, setValue] = useState('');
  return (
    <VStack spacing={2}>
      <Input value={value} onChangeText={setValue} placeholder="Controlled" />
      <Text size="sm" color="textMuted">You typed: {value || '—'}</Text>
    </VStack>
  );
}`,
  },
};
