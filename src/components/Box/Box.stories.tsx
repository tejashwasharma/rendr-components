import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  parameters: { docs: { description: { component: 'The base layout primitive: a View with theme-aware style props. Every other component builds on it.' } } },
  args: { p: 4, bg: 'primary.100', rounded: 'md', children: 'Box with theme-aware style props' },
  argTypes: {
    p: common.space('Padding.'),
    m: common.space('Margin.'),
    gap: common.space('Gap between children.'),
    w: common.text('Width. Numbers are px; strings can be "50%".'),
    h: common.text('Height.'),
    bg: common.color('Background color.'),
    borderColor: common.color('Border color.'),
    borderWidth: common.number('Border width in px.'),
    rounded: common.rounded('none'),
    shadow: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'], description: 'Shadow token (iOS shadow / Android elevation / web box-shadow).' },
    direction: { control: 'select', options: ['row', 'column'], description: 'flexDirection.' },
    align: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch'], description: 'alignItems.' },
    justify: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], description: 'justifyContent.' },
    as: common.node('Render a different element/component, e.g. `as={Pressable}`.'),
    children: common.text('Content.'),
  },
};
export default meta;
type Story = StoryObj<typeof Box>;

export const Playground: Story = {
  parameters: { code: (args: Record<string, unknown>) => code`<Box p={${JSON.stringify(args.p)}} bg="${args.bg}" rounded="${args.rounded}"${args.shadow ? ` shadow="${args.shadow}"` : ''}>
  <Text color="primary.800">${args.children}</Text>
</Box>` },
};

export const Responsive: Story = {
  parameters: {
    code: code`<Box p={[2, 4, 8]} bg={{ base: 'success.100', md: 'warning.100', lg: 'danger.100' }} rounded="lg">
  <Text>Padding and background change with the viewport width — resize the window.</Text>
</Box>`,
  },
};

export const Shadows: Story = {
  parameters: {
    code: code`<HStack spacing={4} wrap="wrap">
  {['sm', 'md', 'lg', 'xl'].map((s) => (
    <Box key={s} p={6} bg="surface" rounded="lg" shadow={s} w={120}>
      <Text align="center">{s}</Text>
    </Box>
  ))}
</HStack>`,
  },
};

export const AsPressable: Story = {
  parameters: {
    code: code`<Box as={Pressable} p={4} bg="secondary.500" rounded="full" onPress={() => alert('pressed')}>
  <Text color="white" align="center">Box rendered as a Pressable</Text>
</Box>`,
  },
};
