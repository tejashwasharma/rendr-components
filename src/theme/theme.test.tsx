import { Text as RNText } from 'react-native';
import { renderWithTheme, render, screen, act } from '../test-utils';
import { createTheme, lightTheme, darkTheme, ThemeProvider } from './index';
import { useTheme, useColorMode } from '../hooks';

describe('createTheme', () => {
  it('returns the default theme when no overrides are given', async () => {
    expect(createTheme()).toEqual(lightTheme);
  });

  it('deep-merges partial overrides without erasing sibling values', async () => {
    const theme = createTheme({ colors: { palette: { primary: { 500: '#000000' } } } });
    expect(theme.colors.palette.primary[500]).toBe('#000000');
    expect(theme.colors.palette.primary[400]).toBe(lightTheme.colors.palette.primary[400]);
    expect(theme.colors.palette.danger).toEqual(lightTheme.colors.palette.danger);
  });

  it('allows adding a brand-new color scheme', async () => {
    const brand = { 50: '#f', 100: '#f', 200: '#f', 300: '#f', 400: '#f', 500: '#ff7a00', 600: '#f', 700: '#f', 800: '#f', 900: '#f' };
    const theme = createTheme({ colors: { palette: { brand } } });
    expect(theme.colors.palette.brand[500]).toBe('#ff7a00');
  });

  it('dark theme swaps semantic colors only', async () => {
    expect(darkTheme.mode).toBe('dark');
    expect(darkTheme.colors.semantic.bg).not.toBe(lightTheme.colors.semantic.bg);
    expect(darkTheme.colors.palette).toEqual(lightTheme.colors.palette);
  });
});

function Probe() {
  const theme = useTheme();
  const { mode } = useColorMode();
  return <RNText testID="probe">{`${mode}:${theme.colors.semantic.bg}:${theme.colors.palette.primary[500]}`}</RNText>;
}

describe('ThemeProvider', () => {
  it('provides the default light theme', async () => {
    await renderWithTheme(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent(`light:${lightTheme.colors.semantic.bg}:`, { exact: false });
  });

  it('falls back to the default theme without a provider', async () => {
    await render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent(`light:${lightTheme.colors.semantic.bg}`, { exact: false });
  });

  it('applies app overrides to every component beneath it', async () => {
    await renderWithTheme(<Probe />, { themeProps: { theme: { colors: { palette: { primary: { 500: '#123456' } } } } } });
    expect(screen.getByTestId('probe')).toHaveTextContent('#123456', { exact: false });
  });

  it('switches to dark mode and applies dark-only overrides', async () => {
    await renderWithTheme(<Probe />, {
      themeProps: { mode: 'dark', darkTheme: { colors: { semantic: { bg: '#010101' } } } },
    });
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#010101', { exact: false });
  });

  it('toggles mode via useColorMode', async () => {
    let api: ReturnType<typeof useColorMode> | undefined;
    function Toggler() {
      api = useColorMode();
      return null;
    }
    await renderWithTheme(
      <>
        <Probe />
        <Toggler />
      </>,
    );
    await act(() => api!.toggle());
    expect(screen.getByTestId('probe')).toHaveTextContent(`dark:${darkTheme.colors.semantic.bg}`, { exact: false });
  });

  it('nested providers layer overrides on the parent theme', async () => {
    await render(
      <ThemeProvider theme={{ colors: { palette: { primary: { 500: '#aaaaaa' } } } }}>
        <ThemeProvider theme={{ colors: { semantic: { bg: '#bbbbbb' } } }}>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('light:#bbbbbb:#aaaaaa', { exact: false });
  });
});
