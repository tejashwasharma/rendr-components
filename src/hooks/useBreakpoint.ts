import { useWindowDimensions } from 'react-native';
import type { Breakpoint } from '../theme/types';
import { BREAKPOINT_ORDER } from '../utils/styleProps';
import { useTheme } from './useTheme';

/** Current breakpoint name derived from the window width and `theme.breakpoints`. */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  let current: Breakpoint = 'base';
  for (const bp of BREAKPOINT_ORDER) {
    if (width >= theme.breakpoints[bp]) current = bp;
  }
  return current;
}

/** Pick the value for the current breakpoint from a responsive value. */
export function useBreakpointValue<T>(values: Partial<Record<Breakpoint, T>> | T[]): T | undefined {
  const bp = useBreakpoint();
  const idx = BREAKPOINT_ORDER.indexOf(bp);
  if (Array.isArray(values)) {
    for (let i = Math.min(idx, values.length - 1); i >= 0; i--) if (values[i] !== undefined) return values[i];
    return undefined;
  }
  for (let i = idx; i >= 0; i--) {
    const v = values[BREAKPOINT_ORDER[i]];
    if (v !== undefined) return v;
  }
  return undefined;
}
