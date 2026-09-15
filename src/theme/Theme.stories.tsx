import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from './ThemeProvider';
import { code } from '../../.storybook/argTypes';

const meta: Meta<typeof ThemeProvider> = {
  title: 'Theme/ThemeProvider',
  component: ThemeProvider,
  argTypes: {
    theme: { control: 'object', description: 'Partial theme deep-merged onto the defaults (both modes).' },
    darkTheme: { control: 'object', description: 'Extra overrides applied only in dark mode.' },
    mode: { control: 'select', options: ['light', 'dark', 'system'], table: { defaultValue: { summary: "'light'" } } },
    glass: { control: 'boolean', description: 'Glass surfaces on (default) or solid.', table: { defaultValue: { summary: 'true' } } },
    blurComponent: { control: false, description: 'Native only: e.g. BlurView from expo-blur.' },
    colorMode: { control: false, description: 'Controlled mode; pair with onModeChange.' },
  },
};
export default meta;

export const AppLevelOverride: StoryObj = {
  parameters: {
    code: code`<ThemeProvider
  theme={createTheme({
    colors: {
      palette: {
        primary: { 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
        brand: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843' },
      },
    },
    radii: { md: 14, lg: 20 },
    components: { Button: { defaultProps: { rounded: 'full' } } },
  })}
>
  <Card>
    <VStack spacing={3}>
      <HStack spacing={2}>
        <Button>Primary (overridden)</Button>
        <Button colorScheme="brand">Brand (custom scheme)</Button>
        <Badge colorScheme="brand" variant="solid">brand</Badge>
      </HStack>
      <Input placeholder="Radius comes from the theme" />
    </VStack>
  </Card>
</ThemeProvider>`,
  },
};

export const GlassSwitch: StoryObj = {
  parameters: {
    code: code`<VStack spacing={4}>
  <ThemeProvider glass>
    <Card><Text weight="semibold">glass (default)</Text><Text size="sm" color="textMuted">Translucent, blurred, lit rim.</Text></Card>
  </ThemeProvider>
  <ThemeProvider glass={false}>
    <Card><Text weight="semibold">glass={'{false}'}</Text><Text size="sm" color="textMuted">Solid white on off-white (light) or slate (dark).</Text></Card>
  </ThemeProvider>
</VStack>`,
  },
};

export const DarkMode: StoryObj = {
  parameters: {
    code: code`() => {
  const Toggle = () => {
    const { mode, toggle } = useColorMode();
    return <Switch label={mode + ' mode'} checked={mode === 'dark'} onChange={toggle} />;
  };
  return (
    <ThemeProvider mode="dark">
      <Box p={6} bg="bg" rounded="lg">
        <Card>
          <VStack spacing={3}>
            <Heading level={4}>Nested dark provider</Heading>
            <HStack spacing={2}><Button>Solid</Button><Button variant="outline">Outline</Button></HStack>
            <Input placeholder="Dark input" />
            <Toggle />
          </VStack>
        </Card>
      </Box>
    </ThemeProvider>
  );
}`,
  },
};

export const Tokens: StoryObj = {
  parameters: {
    code: code`() => {
  const theme = useTheme();
  return (
    <VStack spacing={4}>
      {Object.entries(theme.colors.palette).map(([name, scale]) => (
        <VStack key={name} spacing={1}>
          <Text weight="semibold">{name}</Text>
          <HStack spacing={1}>
            {Object.entries(scale).map(([shade, hex]) => (
              <VStack key={shade} spacing={1} align="center">
                <Box w={40} h={32} bg={hex} rounded="sm" />
                <Text size="xs" color="textMuted">{shade}</Text>
              </VStack>
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}`,
  },
};
