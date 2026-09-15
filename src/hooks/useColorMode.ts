import { useContext } from 'react';
import { ColorModeContext, type ColorModeContextValue } from '../theme/ThemeProvider';

const noop = () => {};

/** Read and change the active color mode. Requires a `ThemeProvider`; otherwise returns a static light mode. */
export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  return ctx ?? { mode: 'light', preference: 'light', setMode: noop, toggle: noop };
}
