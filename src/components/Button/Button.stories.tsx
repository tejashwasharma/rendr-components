import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Button> = {
  title: 'Forms/Button',
  component: Button,
  args: { children: 'Button', variant: 'solid', size: 'md', colorScheme: 'primary' },
  argTypes: {
    children: common.text('Label.'),
    variant: common.variant(['solid', 'outline', 'ghost', 'link', 'subtle'], 'solid'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    rounded: common.rounded(),
    isLoading: common.bool('Shows a spinner and blocks presses.'),
    loadingText: common.text('Text shown next to the spinner while loading.'),
    isDisabled: common.bool('Disables the button.'),
    isFullWidth: common.bool('Stretch to the container width.'),
    leftIcon: common.node('Element rendered before the label.'),
    rightIcon: common.node('Element rendered after the label.'),
    onPress: common.fn('onPress'),
    as: common.node('Render as another pressable component (e.g. a router Link).'),
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    code: code`<VStack spacing={3}>
  {['solid', 'outline', 'subtle', 'ghost', 'link'].map((variant) => (
    <HStack key={variant} spacing={2} wrap="wrap">
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map((c) => (
        <Button key={c} variant={variant} colorScheme={c}>{c}</Button>
      ))}
    </HStack>
  ))}
</VStack>`,
  },
};

export const Sizes: Story = {
  parameters: {
    code: code`<HStack spacing={2} align="flex-end">
  <Button size="xs">xs</Button>
  <Button size="sm">sm</Button>
  <Button size="md">md</Button>
  <Button size="lg">lg</Button>
  <Button size="xl">xl</Button>
</HStack>`,
  },
};

export const WithIcons: Story = {
  parameters: {
    code: code`<HStack spacing={2}>
  <Button leftIcon={<Text color="white">★</Text>}>Left icon</Button>
  <Button variant="outline" rightIcon={<Text color="primary.600">→</Text>}>Right icon</Button>
</HStack>`,
  },
};

export const LoadingAndDisabled: Story = {
  parameters: {
    code: code`() => {
  const [loading, setLoading] = useState(false);
  return (
    <HStack spacing={2}>
      <Button isDisabled>Disabled</Button>
      <Button isLoading>Loading</Button>
      <Button isLoading loadingText="Saving…" variant="outline">Save</Button>
      <Button isLoading={loading} onPress={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
        Click me
      </Button>
    </HStack>
  );
}`,
  },
};

export const ThemeCustomVariant: Story = {
  parameters: {
    code: code`<ThemeProvider
  theme={{
    colors: { palette: { brand: { 50: '#fff4e6', 100: '#ffe8cc', 200: '#ffd8a8', 300: '#ffc078', 400: '#ffa94d', 500: '#ff922b', 600: '#fd7e14', 700: '#f76707', 800: '#e8590c', 900: '#d9480f' } } },
    components: {
      Button: {
        defaultProps: { rounded: 'full' },
        variants: { cta: { container: { backgroundColor: '#111827', paddingHorizontal: 32 }, text: { color: '#fbbf24' } } },
      },
    },
  }}
>
  <HStack spacing={2}>
    <Button colorScheme="brand">Brand solid</Button>
    <Button colorScheme="brand" variant="outline">Brand outline</Button>
    <Button variant="cta">Custom “cta” variant</Button>
  </HStack>
</ThemeProvider>`,
  },
};
