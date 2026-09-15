import React from 'react';
import { Text as RNText, View } from 'react-native';
import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Button } from './Button';
import { IconButton } from '../IconButton/IconButton';
import { lightTheme } from '../../theme';
import type { PressableRef } from '../../utils/refs';

describe('Button', () => {
  it('renders its label and handles presses', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button onPress={onPress}>Save</Button>);
    await fireEvent.press(screen.getByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses solid colors from the color scheme', async () => {
    await renderWithTheme(<Button colorScheme="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: lightTheme.colors.palette.danger[600] });
  });

  it('supports custom color schemes added through the theme', async () => {
    const brand = { ...lightTheme.colors.palette.primary, 600: '#ff7a00' };
    await renderWithTheme(<Button colorScheme="brand">Go</Button>, {
      themeProps: { theme: { colors: { palette: { brand } } } },
    });
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#ff7a00' });
  });

  it('is disabled while loading and shows a spinner', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Button isLoading onPress={onPress}>
        Save
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(screen.getByLabelText('Loading')).toBeTruthy();
    await fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('respects isDisabled', async () => {
    await renderWithTheme(<Button isDisabled>Nope</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icons', async () => {
    await renderWithTheme(
      <Button leftIcon={<View testID="left" />} rightIcon={<View testID="right" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId('left')).toBeTruthy();
    expect(screen.getByTestId('right')).toBeTruthy();
  });

  it('applies theme defaultProps and custom variants', async () => {
    await renderWithTheme(<Button variant="cta">Buy</Button>, {
      themeProps: {
        theme: {
          components: {
            Button: {
              defaultProps: { size: 'xl' },
              variants: { cta: { container: { backgroundColor: '#010203' }, text: { color: '#040506' } } },
            },
          },
        },
      },
    });
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#010203', height: 58 });
    expect(screen.getByText('Buy')).toHaveStyle({ color: '#040506' });
  });

  it('forwards refs and supports `as`', async () => {
    const ref = React.createRef<PressableRef>();
    const Custom = (p: any) => <RNText {...p}>custom</RNText>;
    await renderWithTheme(<Button ref={ref} as={Custom} />);
    expect(screen.getByText('custom')).toBeTruthy();
  });
});

describe('IconButton', () => {
  it('is square and labelled', async () => {
    await renderWithTheme(<IconButton accessibilityLabel="Close" icon={<View testID="icon" />} />);
    const btn = screen.getByLabelText('Close');
    expect(btn).toHaveStyle({ width: 42, height: 42 });
    expect(screen.getByTestId('icon')).toBeTruthy();
  });
});
