# rendr-components

A universal React component library — **one codebase, renders on iOS, Android and the web**.
Built on React Native primitives with `styled-components/native`, and on web through `react-native-web`.
Every component reads its look from a single, fully overridable theme.

- 26 components with proper TypeScript props, `ref` forwarding and a polymorphic `as` prop
- Theme once at the root — every component (including modals, menus, toasts) adopts it
- Light / dark / system color mode
- Add your own color schemes and component variants without wrapping components
- Accessible by default (roles, states, labels, keyboard on web)

## Install

```bash
npm install rendr-components styled-components
```

**React Native / Expo** — that's it (`react-native` is already there).

**Web (Vite / Next.js)** — also install `react-native-web` and alias `react-native` to it:

```bash
npm install react-native-web
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactNativeWeb from 'vite-plugin-react-native-web';

export default defineConfig({
  plugins: [react(), reactNativeWeb()],
  define: { __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'), global: 'window' },
});
```

```js
// next.config.js
module.exports = {
  transpilePackages: ['rendr-components', 'react-native-web'],
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' };
    config.resolve.extensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', ...config.resolve.extensions];
    return config;
  },
};
```

## Quick start

```tsx
import { ThemeProvider, ToastProvider, Button, Card, Heading, Text, VStack } from 'rendr-components';

export default function App() {
  return (
    <ThemeProvider mode="system">
      <ToastProvider>
        <Card>
          <VStack spacing={3}>
            <Heading level={3}>Hello</Heading>
            <Text color="textMuted">Same component on iOS, Android and web.</Text>
            <Button onPress={() => {}}>Get started</Button>
          </VStack>
        </Card>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

## Theming

The library ships a default theme. Your app overrides any part of it once, at the root:

```tsx
import { ThemeProvider, createTheme } from 'rendr-components';

const theme = createTheme({
  colors: {
    palette: {
      primary: { 500: '#6C5CE7', 600: '#5A4BD6' },          // tweak shades
      brand: { 50: '#fff7ed', /* … */ 500: '#f97316', 600: '#ea580c', /* … */ 900: '#7c2d12' }, // add a scheme
    },
    semantic: { bg: '#fafafa' },
  },
  fonts: { body: 'Inter', heading: 'Inter' },
  radii: { md: 12 },
  components: {
    Button: {
      defaultProps: { size: 'lg' },
      variants: { cta: { container: { backgroundColor: '#111827' }, text: { color: '#fbbf24' } } },
    },
  },
});

<ThemeProvider theme={theme} darkTheme={{ colors: { semantic: { bg: '#000' } } }} mode="system">
  <Button colorScheme="brand">Brand</Button>
  <Button variant="cta">Custom variant</Button>
</ThemeProvider>;
```

- `theme` — partial overrides, deep-merged onto the defaults (applies to both modes)
- `darkTheme` — extra overrides for dark mode only
- `mode` — `'light' | 'dark' | 'system'`; `useColorMode()` gives `{ mode, setMode, toggle }`
- `useTheme()` / `useToken('colors.palette.primary.500')` read tokens anywhere
- Nested providers merge with their parent (per-section overrides)
- Type your custom schemes: `declare module 'rendr-components' { interface RendrCustomColors { brand: true } }`

Tokens: `colors.palette.<scheme>[50–900]`, `colors.semantic.{bg, surface, text, textMuted, border, …}`, `spacing`, `radii`, `fontSizes`, `fontWeights`, `lineHeights`, `fonts`, `shadows`, `zIndices`, `breakpoints`.

## Glass UI

Surfaces are **glass by default** — translucent, blurred, with a lit edge and a soft shadow. White glass in light mode, black glass in dark mode. Give the page some colour behind them (a gradient, an image) and they'll show it through.

```tsx
<ThemeProvider>                 // glass on (default)
<ThemeProvider glass={false}>   // solid: white on off-white (light) / slate (dark)
<Card glass={false}>            // opt a single surface out
```

- Web uses CSS `backdrop-filter`. On iOS/Android pass a blur view: `<ThemeProvider blurComponent={BlurView}>` (from `expo-blur`); without it native surfaces are a translucent tint.
- Tune with `theme.glass = { blur, saturate, rim, overlayBlur }`.
- Motion: hover/press 140ms, open/close and the sliding selection pill (Tabs, Pagination) 240ms, theme switch 420ms.

Full spec: [`docs/GLASS.md`](docs/GLASS.md).

## Style props

Layout primitives (and most components) accept theme-aware style props:

```tsx
<Box p={4} mx="auto" bg="primary.50" rounded="lg" shadow="md" w="100%" maxW={480}>
<Flex justify="space-between" align="center" gap={2}>
<Box p={[2, 4, 8]} bg={{ base: 'success.100', md: 'warning.100' }}>  {/* responsive */}
```

Spacing props (`p`, `m`, `gap`…) map numbers to `theme.spacing` (`4` → 16px). Dimension props (`w`, `h`, `top`…) treat numbers as px.

## Components

| Category | Components |
|---|---|
| Layout | `Box`, `Flex`, `Stack` / `HStack` / `VStack`, `Grid` |
| Typography | `Text`, `Heading` |
| Forms | `Button`, `IconButton`, `Input`, `Textarea`, `FormField`, `Select`, `Checkbox`, `Radio` / `RadioGroup`, `Switch` |
| Display | `Badge`, `Avatar` / `AvatarGroup`, `Card`, `Spinner`, `Skeleton` / `SkeletonText` / `SkeletonCircle` |
| Overlay | `Modal`, `Menu`, `Tooltip`, `Popover`, `ToastProvider` + `useToast` |
| Navigation | `Tabs`, `Accordion`, `Pagination` |
| Data | `Table` |

All components forward `ref` and accept `as`:

```tsx
<Button as={Link} href="/docs">Docs</Button>
<Box as={Pressable} onPress={...} />
```

Platform notes: `Menu` and `Select` anchor to their trigger on web and present as a bottom sheet on native (`mode` overrides). `Tooltip` shows on hover/focus on web and long-press on native. `Modal` closes on Esc (web) / back button (Android).

## Development

```bash
npm install
npm run storybook   # interactive docs: Controls (props) + Live Code (edit & re-render) for every component
npm test            # Jest + Testing Library
npm run typecheck
npm run lint
npm run build       # react-native-builder-bob → lib/{commonjs,module,typescript}
cd example && npm install && npx expo start --ios   # device / simulator testing
```

The Storybook has a **Live Code** panel (next to Controls): the code shown is the component snippet for the current story; edit it and the canvas re-renders as you type. Changing a Control updates the code.

## License

MIT

## Docs site

The Storybook build is hosted at **https://rendr-components.web.app** (Firebase Hosting, project `rendr-components`).

```bash
cp .env.example .env   # fill in Firebase web config from the console (see below)
npm run deploy         # builds Storybook and deploys to Firebase Hosting
```

Firebase config lives in `.env` (git-ignored — see `.env.example`), read via `VITE_FIREBASE_*` vars in `.storybook/firebase.ts` and baked into the build at build time. These are the public web SDK keys (safe to ship to the browser; Firebase restricts access via security rules, not secrecy), kept out of git as ordinary environment config rather than hard-coded in source. Analytics initializes once, only in a real browser, and no-ops silently if `.env` is missing.

Hosting config: `firebase.json` (serves `storybook-static`, immutable caching for hashed assets, SPA rewrite) + `.firebaserc` (project alias). Deploying requires `firebase login` once per machine.
