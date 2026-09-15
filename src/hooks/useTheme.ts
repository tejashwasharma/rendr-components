import { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import type { Theme } from '../theme/types';
import { lightTheme } from '../theme/lightTheme';
import { isTheme } from '../theme/createTheme';

/**
 * The active theme. Falls back to the built-in light theme when no
 * `ThemeProvider` is mounted so components always render.
 */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  return isTheme(theme) ? theme : lightTheme;
}
