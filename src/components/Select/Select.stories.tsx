import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { common, code } from '../../../.storybook/argTypes';

const options = [
  { label: 'India', value: 'in' },
  { label: 'United States', value: 'us' },
  { label: 'Germany', value: 'de' },
  { label: 'Antarctica', value: 'aq', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
  args: { options, placeholder: 'Choose a country', variant: 'outline', size: 'md' },
  argTypes: {
    options: { control: 'object', description: '`{ label, value, disabled?, icon? }[]`' },
    placeholder: common.text('Placeholder.', "'Select…'"),
    variant: common.variant(['outline', 'filled', 'flushed', 'unstyled'], 'outline'),
    size: common.size(),
    isInvalid: common.bool('Danger border.'),
    isDisabled: common.bool('Disabled.'),
    mode: { control: 'select', options: ['anchored', 'sheet'], description: 'Dropdown vs bottom sheet. Default: anchored on web, sheet on native.' },
    onChange: common.fn('onChange'),
    value: common.hidden,
    defaultValue: common.hidden,
  },
};
export default meta;

export const Playground: StoryObj<typeof Select> = {
  parameters: { code: (args: Record<string, unknown>) => code`<Select
  options={${JSON.stringify(args.options)}}
  placeholder="${args.placeholder}"
  variant="${args.variant}"
  size="${args.size}"${args.isInvalid ? '\n  isInvalid' : ''}${args.isDisabled ? '\n  isDisabled' : ''}${args.mode ? `\n  mode="${args.mode}"` : ''}
/>` },
};

export const Controlled: StoryObj = {
  parameters: {
    code: code`() => {
  const [country, setCountry] = useState(null);
  const options = [
    { label: 'India', value: 'in' },
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
  ];
  return (
    <VStack spacing={2}>
      <Select options={options} value={country} onChange={setCountry} placeholder="Choose a country" />
      <Text size="sm" color="textMuted">Selected: {country ?? '—'}</Text>
    </VStack>
  );
}`,
  },
};
