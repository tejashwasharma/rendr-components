import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { View } from 'react-native';
import { ThemeProvider, glassAmbient, glassDarkSemanticColors, glassLightSemanticColors, lightSemanticColors, darkSemanticColors } from '../src/theme';
import { ToastProvider } from '../src/components/Toast';
import { withLiveCode } from './live-code/preview';
import { getFirebaseAnalytics } from './firebase';

// Fire once when the docs site loads in a real browser; no-ops in tests/SSR
// and if VITE_FIREBASE_* env vars aren't set (see .env.example).
if (typeof window !== 'undefined') {
  getFirebaseAnalytics().catch(() => undefined);
}

const preview: Preview = {
  globalTypes: {
    mode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    glass: {
      description: 'Glass surfaces',
      toolbar: {
        title: 'Glass',
        icon: 'contrast',
        items: [
          { value: 'on', title: 'Glass on' },
          { value: 'off', title: 'Glass off' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: 'light', glass: 'on' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    options: {
      storySort: { order: ['Theme', 'Layout', 'Typography', 'Forms', 'Display', 'Overlay', 'Navigation', 'Data'] },
    },
  },
  decorators: [
    withLiveCode,
    (Story, ctx) => {
      const mode = (ctx.globals.mode as 'light' | 'dark') ?? 'light';
      const glass = (ctx.globals.glass as string) !== 'off';
      const semantic = glass ? (mode === 'dark' ? glassDarkSemanticColors : glassLightSemanticColors) : mode === 'dark' ? darkSemanticColors : lightSemanticColors;
      return (
        <ThemeProvider mode={mode} glass={glass}>
          <ToastProvider>
            <View style={{ flex: 1, minHeight: 260, padding: 16, backgroundColor: semantic.bg, overflow: 'hidden', position: 'relative' }}>
              {glass ? <Ambient /> : null}
              <View style={{ position: 'relative' }}>
                <Story />
              </View>
            </View>
          </ToastProvider>
        </ThemeProvider>
      );
    },
  ],
};

/** Soft colour behind the canvas so the glass has something to blur. */
function Ambient() {
  const blob = (color: string, style: object) => (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 420,
        height: 420,
        borderRadius: 210,
        backgroundColor: color,
        opacity: 0.55,
        // @ts-expect-error web-only
        filter: 'blur(70px)',
        ...style,
      }}
    />
  );
  return (
    <>
      {blob(glassAmbient.a, { left: -120, top: -80 })}
      {blob(glassAmbient.b, { right: -140, top: 120 })}
      {blob(glassAmbient.c, { left: '40%', bottom: -220, opacity: 0.4 })}
    </>
  );
}

export default preview;
