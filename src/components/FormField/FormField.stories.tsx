import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof FormField> = {
  title: 'Forms/FormField',
  component: FormField,
  argTypes: {
    label: common.text('Label above (or left of) the control.'),
    helperText: common.text('Neutral hint below.'),
    errorText: common.text('Shown instead of helperText when isInvalid.'),
    isInvalid: common.bool('Marks the field and its control invalid.'),
    isRequired: common.bool('Adds * and aria-required.'),
    isDisabled: common.bool('Disables the control inside.'),
    labelPosition: { control: 'select', options: ['top', 'left'], table: { defaultValue: { summary: "'top'" } } },
  },
};
export default meta;

export const WithInput: StoryObj = {
  parameters: {
    code: code`() => {
  const [email, setEmail] = useState('');
  const invalid = email.length > 0 && !email.includes('@');
  return (
    <FormField label="Email" isRequired isInvalid={invalid} errorText="Enter a valid email" helperText="We never share it.">
      <Input value={email} onChangeText={setEmail} placeholder="you@example.com" />
    </FormField>
  );
}`,
  },
};

export const States: StoryObj = {
  parameters: {
    code: code`<VStack spacing={4}>
  <FormField label="Disabled" isDisabled helperText="Can't edit this one">
    <Input placeholder="…" />
  </FormField>
  <FormField label="Inline label" labelPosition="left">
    <Input placeholder="Label on the left" />
  </FormField>
  <FormField label="With a select">
    <Select options={[{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]} />
  </FormField>
</VStack>`,
  },
};
