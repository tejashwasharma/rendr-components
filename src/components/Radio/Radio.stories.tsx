import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/Radio',
  component: RadioGroup,
  argTypes: {
    value: common.text('Controlled value.'),
    defaultValue: common.text('Initial value (uncontrolled).'),
    onChange: common.fn('onChange'),
    direction: { control: 'select', options: ['row', 'column'], table: { defaultValue: { summary: "'column'" } } },
    spacing: common.space('Gap between radios.', '3'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    isDisabled: common.bool('Disables every radio.'),
  },
};
export default meta;

export const Group: StoryObj = {
  parameters: {
    code: code`() => {
  const [plan, setPlan] = useState('pro');
  return (
    <VStack spacing={3}>
      <RadioGroup value={plan} onChange={setPlan} direction="row" spacing={6}>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
        <Radio value="team" label="Team" />
      </RadioGroup>
      <Text size="sm" color="textMuted">Plan: {plan}</Text>
    </VStack>
  );
}`,
  },
};

export const SizesAndSchemes: StoryObj = {
  parameters: {
    code: code`<VStack spacing={3}>
  {['xs', 'sm', 'md', 'lg', 'xl'].map((s) => (
    <RadioGroup key={s} defaultValue="a" direction="row" size={s} colorScheme="secondary">
      <Radio value="a" label={'Radio ' + s} />
      <Radio value="b" label="Other" />
    </RadioGroup>
  ))}
</VStack>`,
  },
};
