import { getToken } from '../utils/getToken';
import { useTheme } from './useTheme';

/** Read a theme token by dotted path: `useToken('colors.palette.primary.500')`. */
export function useToken<T = unknown>(path: string, fallback?: T): T {
  const theme = useTheme();
  const value = getToken(theme, path);
  return (value === undefined ? fallback : value) as T;
}
