import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import type { ColorMode, ColorModePreference, Theme, ThemeOverride } from './types';
import { lightTheme } from './lightTheme';
import { semanticFor } from './tokens';
import { deepMerge } from '../utils/deepMerge';

export interface ColorModeContextValue {
  /** Resolved color mode currently applied. */
  mode: ColorMode;
  /** The preference in effect (`'system'` follows the OS). */
  preference: ColorModePreference;
  setMode: (mode: ColorModePreference) => void;
  toggle: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

/**
 * A component that blurs what's behind it on native (e.g. `BlurView` from
 * `expo-blur`). Rendered absolutely-filled inside glass surfaces; receives
 * `intensity` (0–100) and `tint` ('light' | 'dark').
 */
export type BlurComponent = React.ComponentType<{ intensity?: number; tint?: 'light' | 'dark'; style?: any; children?: React.ReactNode }>;

interface RendrThemeContextValue {
  light: Theme;
  dark: Theme;
  glass: boolean;
  blurComponent?: BlurComponent;
}

/** Holds both resolved themes so nested providers can layer overrides. */
export const RendrThemeContext = createContext<RendrThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  /**
   * Theme overrides (or a complete theme) applied to both light and dark
   * modes. Partial objects are deep-merged onto the defaults, or onto the
   * parent provider's theme when nested.
   */
  theme?: ThemeOverride;
  /** Extra overrides applied only in dark mode, on top of `theme`. */
  darkTheme?: ThemeOverride;
  /** Initial color mode. `'system'` follows the OS appearance. */
  mode?: ColorModePreference;
  /** Controlled color mode. When set, `onModeChange` receives requested changes. */
  colorMode?: ColorModePreference;
  onModeChange?: (mode: ColorModePreference) => void;
  /**
   * Glass UI switch. `true` (default): frosted, translucent surfaces — white
   * blur in light mode, black blur in dark mode. `false`: solid surfaces —
   * white / off-white with black text in light mode, slate in dark mode.
   * Nested providers inherit the parent's value unless set.
   */
  glass?: boolean;
  /**
   * Native only: a blur view (e.g. `BlurView` from `expo-blur`) used behind
   * glass surfaces. Without it, native surfaces fall back to a translucent
   * tint (no blur). Web uses CSS `backdrop-filter` and ignores this.
   */
  blurComponent?: BlurComponent;
  children?: React.ReactNode;
}

export function ThemeProvider({
  theme: overrides,
  darkTheme: darkOverrides,
  mode,
  colorMode,
  onModeChange,
  glass: glassProp,
  blurComponent: blurProp,
  children,
}: ThemeProviderProps) {
  const parent = useContext(RendrThemeContext);
  const parentMode = useContext(ColorModeContext);
  const systemScheme = useColorScheme();

  const [internalPreference, setInternalPreference] = useState<ColorModePreference>(mode ?? 'light');
  useEffect(() => {
    if (mode !== undefined) setInternalPreference(mode);
  }, [mode]);

  // Precedence: controlled `colorMode` > own `mode` > parent provider > 'light'.
  const inheritsFromParent = colorMode === undefined && mode === undefined && !!parentMode;
  const preference: ColorModePreference =
    colorMode ?? (inheritsFromParent ? parentMode!.preference : internalPreference);

  const setMode = useCallback(
    (next: ColorModePreference) => {
      onModeChange?.(next);
      if (inheritsFromParent) parentMode!.setMode(next);
      else if (colorMode === undefined) setInternalPreference(next);
    },
    [colorMode, onModeChange, inheritsFromParent, parentMode],
  );

  const resolvedMode: ColorMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const toggle = useCallback(() => {
    setMode(resolvedMode === 'dark' ? 'light' : 'dark');
  }, [resolvedMode, setMode]);

  const glass = glassProp ?? parent?.glass ?? true;
  const blurComponent = blurProp ?? parent?.blurComponent;

  const themes = useMemo<RendrThemeContextValue>(() => {
    const glassChanged = parent ? parent.glass !== glass : true;
    // Base: parent themes, or the defaults. When the glass switch differs from
    // the parent (or there is no parent) the semantic set is swapped for the
    // requested one before user overrides are applied.
    const baseLight = deepMerge(parent?.light ?? lightTheme, glassChanged ? { colors: { semantic: semanticFor('light', glass) } } : {});
    const baseDark = deepMerge(parent?.dark ?? lightTheme, { mode: 'dark', ...(glassChanged || !parent ? { colors: { semantic: semanticFor('dark', glass) } } : {}) });

    const light = deepMerge(deepMerge(baseLight, { mode: 'light', glass: { enabled: glass } }), overrides ?? {}) as Theme;
    // Dark = base dark + shared overrides + dark-only overrides.
    const dark = deepMerge(
      deepMerge(deepMerge(baseDark, { mode: 'dark', glass: { enabled: glass } }), overrides ?? {}),
      darkOverrides ?? {},
    ) as Theme;

    return { light: { ...light, mode: 'light' }, dark: { ...dark, mode: 'dark' }, glass, blurComponent };
  }, [parent, overrides, darkOverrides, glass, blurComponent]);

  const activeTheme = resolvedMode === 'dark' ? themes.dark : themes.light;

  const colorModeValue = useMemo<ColorModeContextValue>(
    () => ({ mode: resolvedMode, preference, setMode, toggle }),
    [resolvedMode, preference, setMode, toggle],
  );

  return (
    <RendrThemeContext.Provider value={themes}>
      <ColorModeContext.Provider value={colorModeValue}>
        <StyledThemeProvider theme={activeTheme}>{children}</StyledThemeProvider>
      </ColorModeContext.Provider>
    </RendrThemeContext.Provider>
  );
}

ThemeProvider.displayName = 'ThemeProvider';
