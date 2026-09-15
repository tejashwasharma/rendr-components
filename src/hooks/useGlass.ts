import { useContext } from 'react';
import { RendrThemeContext } from '../theme/ThemeProvider';
import { useTheme } from './useTheme';

/** Whether glass surfaces are enabled, plus the native blur component if one was provided. */
export function useGlass() {
  const ctx = useContext(RendrThemeContext);
  const theme = useTheme();
  return { enabled: theme.glass.enabled, blurComponent: ctx?.blurComponent, settings: theme.glass };
}
