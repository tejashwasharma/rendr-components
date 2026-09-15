import { Text as RNText } from 'react-native';
import { renderWithTheme, render, screen } from '../../test-utils';
import { Surface } from './Surface';
import { Card } from '../Card/Card';
import { ThemeProvider, glassLightSemanticColors, glassDarkSemanticColors, lightSemanticColors, darkSemanticColors } from '../../theme';
import { useTheme, useGlass } from '../../hooks';

describe('Surface', () => {
  it('is glass by default: translucent fill and lit rim', async () => {
    await renderWithTheme(<Surface testID="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({
      backgroundColor: glassLightSemanticColors.surface,
      borderTopColor: glassLightSemanticColors.rimStart,
      borderBottomColor: glassLightSemanticColors.rimEnd,
    });
  });

  it('turns solid when the provider disables glass', async () => {
    await renderWithTheme(<Surface testID="s" />, { themeProps: { glass: false } });
    const s = screen.getByTestId('s');
    expect(s).toHaveStyle({ backgroundColor: lightSemanticColors.surface, borderColor: lightSemanticColors.border });
    expect(s.props.style).not.toEqual(expect.objectContaining({ borderTopColor: expect.anything() }));
  });

  it('uses black glass in dark mode and slate when solid', async () => {
    await renderWithTheme(<Surface testID="s" />, { themeProps: { mode: 'dark' } });
    expect(screen.getByTestId('s')).toHaveStyle({ backgroundColor: glassDarkSemanticColors.surface });
    await renderWithTheme(<Surface testID="t" />, { themeProps: { mode: 'dark', glass: false } });
    expect(screen.getByTestId('t')).toHaveStyle({ backgroundColor: darkSemanticColors.surface });
  });

  it('can opt a single surface out of glass', async () => {
    await renderWithTheme(<Surface testID="s" glass={false} />);
    expect(screen.getByTestId('s')).toHaveStyle({ backgroundColor: lightSemanticColors.surface });
  });

  it('renders variants from the semantic tokens', async () => {
    await renderWithTheme(
      <>
        <Surface testID="subtle" variant="subtle" />
        <Surface testID="field" variant="field" />
        <Surface testID="plain" variant="plain" />
      </>,
    );
    expect(screen.getByTestId('subtle')).toHaveStyle({ backgroundColor: glassLightSemanticColors.surfaceSubtle });
    expect(screen.getByTestId('field')).toHaveStyle({ backgroundColor: glassLightSemanticColors.field });
    expect(screen.getByTestId('plain')).toHaveStyle({ backgroundColor: 'transparent' });
  });

  it('renders the native blur component when one is provided', async () => {
    const Blur = ({ intensity, tint }: { intensity?: number; tint?: string }) => <RNText testID="blur">{`${tint}:${intensity}`}</RNText>;
    await renderWithTheme(<Surface />, { themeProps: { blurComponent: Blur } });
    expect(screen.getByTestId('blur')).toHaveTextContent('light:60');
  });
});

describe('glass switch on the provider', () => {
  function Probe() {
    const theme = useTheme();
    const { enabled } = useGlass();
    return <RNText testID="p">{`${enabled}:${theme.colors.semantic.bg}:${theme.colors.semantic.text}`}</RNText>;
  }

  it('defaults to glass on', async () => {
    await render(<Probe />);
    expect(screen.getByTestId('p')).toHaveTextContent(`true:${glassLightSemanticColors.bg}`, { exact: false });
  });

  it('glass off → light is white/off-white with black text', async () => {
    await render(
      <ThemeProvider glass={false}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('p')).toHaveTextContent(`false:${lightSemanticColors.bg}:${lightSemanticColors.text}`);
  });

  it('nested provider can flip glass for a subtree', async () => {
    await render(
      <ThemeProvider>
        <ThemeProvider glass={false}>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('p')).toHaveTextContent('false:', { exact: false });
  });

  it('Card follows the switch', async () => {
    await renderWithTheme(<Card testID="c" />, { themeProps: { glass: false } });
    expect(screen.getByTestId('c')).toHaveStyle({ backgroundColor: lightSemanticColors.surface });
  });
});
