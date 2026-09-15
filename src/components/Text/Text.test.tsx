import { renderWithTheme, screen } from '../../test-utils';
import { Text } from './Text';
import { Heading } from '../Heading/Heading';
import { lightTheme } from '../../theme';

describe('Text', () => {
  it('applies theme size, weight and color', async () => {
    await renderWithTheme(
      <Text size="lg" weight="bold" color="primary.600">
        Hello
      </Text>,
    );
    expect(screen.getByText('Hello')).toHaveStyle({
      fontSize: lightTheme.fontSizes.lg,
      fontWeight: '700',
      color: lightTheme.colors.palette.primary[600],
    });
  });

  it('truncates with numberOfLines', async () => {
    await renderWithTheme(<Text truncate>Long</Text>);
    expect(screen.getByText('Long').props.numberOfLines).toBe(1);
  });

  it('honours theme component defaultProps', async () => {
    await renderWithTheme(<Text>Hi</Text>, {
      themeProps: { theme: { components: { Text: { defaultProps: { color: 'danger.500' } } } } },
    });
    expect(screen.getByText('Hi')).toHaveStyle({ color: lightTheme.colors.palette.danger[500] });
  });
});

describe('Heading', () => {
  it('sizes by level and sets header role', async () => {
    await renderWithTheme(<Heading level={1}>Title</Heading>);
    const el = screen.getByText('Title');
    expect(el).toHaveStyle({ fontSize: lightTheme.fontSizes['4xl'] });
    expect(el.props.accessibilityRole).toBe('header');
  });
});
