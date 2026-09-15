import { Platform } from 'react-native';
import type { Theme } from '../theme/types';

export type MotionSpeed = 'fast' | 'normal' | 'slow' | 'theme';

/**
 * Web-only CSS transition for the given properties. Returns `{}` on native,
 * where components animate with `Animated` instead.
 */
export function webTransition(theme: Theme, properties: string[], speed: MotionSpeed = 'fast'): Record<string, unknown> {
  if (Platform.OS !== 'web') return {};
  return {
    transitionProperty: properties.join(', '),
    transitionDuration: `${theme.durations[speed]}ms`,
    transitionTimingFunction: theme.easing.standard,
  };
}

/** Properties that change when the theme (glass/mode) switches. */
export const THEME_TRANSITION_PROPS = ['background-color', 'border-color', 'color', 'box-shadow', 'backdrop-filter', '-webkit-backdrop-filter', 'opacity'];

/** Standard web transition for any themed surface: theme switch + hover colours. */
export function surfaceTransition(theme: Theme): Record<string, unknown> {
  return webTransition(theme, THEME_TRANSITION_PROPS, 'normal');
}
