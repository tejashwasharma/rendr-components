# Glass UI — design spec

Status: **implemented (v0.1.0)** · Prototype that was approved: https://claude.ai/artifact/3sKHG6oV9BYv4ufVxmTDMW

## Where it comes from

Figma community file "Glassmorphism UI, with code!" — a 3-step recipe on a 412×660, radius-40 rectangle:

1. **Fill**: radial gradient `#FFFFFF` 40% → 0% (top-left → bottom-right). A soft highlight, not a flat tint.
2. **Background blur: 42** — blurs whatever sits *behind* the shape. This is the actual "glass".
3. **Stroke** outside 3.5px with stacked radial fills `#151515`, `#e64467`, `#ffffff` (each 100% → 0%) — a rim that reads as a lit edge.

Takeaways: glass only reads when there is colour behind it; the effect is *low-alpha fill + heavy blur + bright rim*; a soft drop shadow lifts the sheet.

## Decisions for rendr-components

- **Glass is the default.** Every surface component renders as a glass sheet.
- **One switch on the app wrapper:** `<ThemeProvider glass={false}>` turns it off everywhere (also exposed as `theme.glass.enabled`; nested providers can flip it for a subtree).
- **Follows color mode:**
  - glass · light → white blur (white sheet ~46% alpha, blur 24px, bright white rim)
  - glass · dark → black blur (near-black sheet ~52% alpha, blur 24px, faint white rim)
- **Dark-mode glass drops the border/rim** — a hard 1px edge on a near-black ground read worse than no border; the halo shadow alone carries the "floating sheet" cue there. Light-mode glass keeps the lit rim; solid (glass off) surfaces in both modes keep a normal border.
- **Glass off:**
  - light → white surfaces on an off-white ground (`bg #f5f6f8`, `surface #ffffff`), black text `#0f1219`
  - dark → the existing dark theme (`bg #0f172a`, `surface #1e293b`, `text #f8fafc`)
- **Drop shadow** on sheets in every state (softer/inset-highlight in glass, plain in solid).
- Accent palettes (primary/success/…) are unchanged; solid buttons stay opaque so they stay legible on glass.

## Tokens (in `theme`)

```ts
theme.glass = {
  enabled: true,
  blur: 24,            // px; Figma uses 42 on a large card — 24 suits component scale
  saturate: 1.4,       // web only: backdrop-filter saturate()
  rim: true,           // gradient 1px ring
};

// colors.semantic gains glass-aware values (resolved by mode + glass):
//                     glass·light                 glass·dark                    solid·light   solid·dark
// surface             rgba(255,255,255,.46)       rgba(12,14,22,.52)            #ffffff       #1e293b
// surfaceSubtle       rgba(255,255,255,.28)       rgba(12,14,22,.36)            #f1f3f6       #162032
// surfaceHover        rgba(255,255,255,.62)       rgba(255,255,255,.08)         #f1f3f6       #334155
// border              rgba(255,255,255,.55)       rgba(255,255,255,.12)         #e3e6ec       #334155
// borderStrong        rgba(255,255,255,.85)       rgba(255,255,255,.24)         #cfd4dd       #475569
// bg                  #eceef4                     #07080d                       #f5f6f8       #0f172a
// field (inputs)      rgba(255,255,255,.38)       rgba(0,0,0,.28)               #ffffff       #0f172a
// overlay (modal)     rgba(40,44,70,.28)+blur/4   rgba(0,0,0,.5)+blur/4         rgba(15,18,25,.45)  rgba(0,0,0,.6)
// rim gradient        white .95 → .25 → .05       white .45 → .08 → black .2    none          none
```

Shadows (glass): `inset 0 1px 1px rgba(255,255,255,.6)` + `0 12px 32px -14px rgba(20,24,60,.28)` (light); `inset 0 1px 0 rgba(255,255,255,.08)` + `0 12px 32px -12px rgba(0,0,0,.7)` + **white halo** — a crisp `0 0 0 1px rgba(255,255,255,.18)` edge plus a wider `0 0 ~48px rgba(255,255,255,.10)` bloom (dark — a dark drop alone is invisible on a dark ground; the halo restores the floating cue even when there's no colour behind the sheet to show the blur itself). iOS dark uses a white 22% shadow; Android keeps elevation.

## Per-platform rendering

| | Web (react-native-web) | iOS / Android |
|---|---|---|
| Blur | `backdropFilter: blur(24px) saturate(1.4)` (+ `-webkit-`) | `expo-blur` `BlurView` (optional peer). If not installed → translucent fill only (still looks like a tinted sheet) |
| Rim | masked `::before` gradient ring → implemented as an absolutely-positioned `LinearGradient` border layer, or a 1px semi-transparent border fallback | same, via `expo-linear-gradient` if present, else 1px border |
| Shadow | `boxShadow` | iOS `shadow*`, Android `elevation` |

A single internal primitive **`Surface`** (Box + glass recipe) is the only place the recipe lives; Card, Modal, Menu list, Select list, Popover, Toast, Tabs (enclosed list), Table container, Input/Select fields, Accordion (separated) and outline Buttons all render through it.

## Components affected

Sheets (full glass): Card, Modal, Menu.List, Select list, Popover, Tooltip, Toast, Accordion (`separated`), Table (`outline`), Tabs.List (`enclosed`), Skeleton base.
Fields (field glass): Input, Textarea, Select trigger, Button `outline`.
Unchanged (opaque by design): Button `solid`/`subtle`, Badge, Avatar, Switch, Checkbox, Radio, Spinner, Text, Heading, layout primitives.

## Implementation map

| Piece | Where |
|---|---|
| Four semantic colour sets (`lightSemanticColors`, `darkSemanticColors`, `glassLightSemanticColors`, `glassDarkSemanticColors`) + `semanticFor(mode, glass)` | `src/theme/tokens.ts` |
| `theme.glass` (`enabled`, `blur`, `saturate`, `rim`, `overlayBlur`), `theme.durations` (`fast`/`normal`/`theme`), `theme.easing`, `glassShadows` | `src/theme/tokens.ts` |
| `lightTheme` / `darkTheme` (glass on) and `solidLightTheme` / `solidDarkTheme` | `src/theme/lightTheme.ts`, `darkTheme.ts` |
| `<ThemeProvider glass blurComponent>` — picks the semantic set, nested providers inherit or flip | `src/theme/ThemeProvider.tsx` |
| `useGlass()` → `{ enabled, blurComponent, settings }` | `src/hooks/useGlass.ts` |
| **`Surface`** — the single glass recipe (`sheet` / `subtle` / `field` / `plain`, `rim`, `shadow`, per-surface `glass` override, native `blurComponent`). Border/rim is skipped in dark-mode glass; the halo shadow alone marks the edge. | `src/components/Surface/Surface.tsx` |
| Glass-aware shadows (`resolveShadow(theme, name, glass)`) | `src/utils/shadow.ts` |
| Web transitions (`webTransition`, `surfaceTransition`) | `src/utils/motion.ts` |
| Sliding selection pill (`useSlidingIndicator`) used by Tabs and Pagination | `src/hooks/useSlidingIndicator.ts` |
| Components on `Surface`: Card, Modal (dialog + blurred overlay), Menu.List, Select list, Popover sheet, Tooltip, Toast, Accordion `separated`, Table `outline`, Tabs.List `enclosed` | respective component files |
| Field glass (`semantic.field` + blur on web): Input, Textarea, Select trigger, Button `outline`, Checkbox/Radio boxes | `useInputStyles.ts`, `Button.tsx`, … |
| Storybook: **Glass** toolbar toggle + ambient blobs behind the canvas | `.storybook/preview.tsx` |

Rim on native: React Native has no gradient borders, so the rim is the 1px border with `rimStart` on top/left and `rimEnd` on bottom/right — reads as the same lit edge as the CSS gradient.

## Usage

```tsx
<ThemeProvider mode="system">                      // glass on (default)
<ThemeProvider glass={false}>                      // solid white/off-white (light) or slate (dark)
<ThemeProvider theme={{ glass: { blur: 16, rim: false } }}>   // tune
<ThemeProvider blurComponent={BlurView}>           // native blur (expo-blur); web ignores it
<Card glass={false}> / <Surface glass>             // per-component override

// Native blur:
import { BlurView } from 'expo-blur';
<ThemeProvider blurComponent={BlurView}>…</ThemeProvider>
```

Without `blurComponent`, native glass surfaces are translucent tints (still readable, no blur).

## Storybook

Toolbar has **Mode** (light/dark) and **Glass** (on/off). When glass is on, the canvas paints three soft ambient blobs behind the story so the blur has something to show through. `Layout/Surface` and `Theme/ThemeProvider → GlassSwitch` stories demonstrate the switch directly.

## Motion

Three durations, one easing (`cubic-bezier(.2,.7,.2,1)`), exposed as `theme.durations`:

| Token | Value | Used for |
|---|---|---|
| `fast` | 140ms | hover / press: colour and border changes only (button, field, tab, menu item, row, checkbox, switch). **No lift / translate on hover.** |
| `normal` | 240ms | open / close: menu (fade + 6px slide from the trigger), modal (backdrop fade + 12px rise), toast (slide in / out). **Selection pill slide** in Tabs (`enclosed`/`pills`/`soft`) and segmented controls: one indicator element moves with `transform: translateX` + width to the newly selected item instead of each tab re-styling itself. |
| `theme` | 420ms | glass ↔ solid and light ↔ dark: every surface, border, text colour, shadow and blur cross-fades instead of snapping |

Press state: `scale(.97)` at 60ms (the only transform on interaction). Ambient blobs drift slowly (18–30s, alternate) so the glass never looks static. All motion is disabled under `prefers-reduced-motion`.

Native mapping: `Animated.timing` with the same durations; the tab pill uses `onLayout` per tab + `Animated.spring`/`timing` on `translateX`/`width`; blur cannot be animated on native (`BlurView` intensity switches instantly), so only fill/border/shadow cross-fade there.

## Docs site deployment note

Deploying Storybook's production build (`npm run storybook:build`) surfaced a real bug unrelated to glass: `react-live`'s JSX transform (`sucrase`) does dynamic `require()` calls that Rollup's CJS→ESM conversion can't statically resolve, so bare `require()` calls survived into the browser bundle and crashed every story (`ReferenceError: require is not defined`) — invisible in `npm run storybook` (Vite dev server, which esbuild-prebundles deps correctly) but fatal in the built site. Fixed by forcing `react-live`/`sucrase` through esbuild's dependency pre-bundling in `.storybook/main.ts`'s `viteFinal` (`optimizeDeps.include` + `build.commonjsOptions.transformMixedEsModules`). Verified via a local Firebase Hosting emulator (`firebase serve`) before redeploying, since `npm run storybook build` alone doesn't catch runtime bundle issues.
