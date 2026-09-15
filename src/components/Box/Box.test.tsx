import React from 'react';
import { Pressable } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Box } from './Box';
import { lightTheme } from '../../theme';

describe('Box', () => {
  it('resolves style props against the theme', async () => {
    await renderWithTheme(<Box testID="box" p={4} bg="primary.500" rounded="md" />);
    expect(screen.getByTestId('box')).toHaveStyle({
      padding: lightTheme.spacing[4],
      backgroundColor: lightTheme.colors.palette.primary[500],
      borderRadius: lightTheme.radii.md,
    });
  });

  it('passes raw values through', async () => {
    await renderWithTheme(<Box testID="box" p={13} bg="#abcdef" w="50%" />);
    expect(screen.getByTestId('box')).toHaveStyle({ padding: 13, backgroundColor: '#abcdef', width: '50%' });
  });

  it('forwards refs', async () => {
    const ref = React.createRef<ViewRef>();
    await renderWithTheme(<Box ref={ref} />);
    expect(ref.current).toBeTruthy();
  });

  it('renders as another component via `as`', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Box as={Pressable} testID="box" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('box'));
    expect(onPress).toHaveBeenCalled();
  });

  it('merges the style prop after style props', async () => {
    await renderWithTheme(<Box testID="box" p={4} style={{ padding: 1 }} />);
    expect(screen.getByTestId('box')).toHaveStyle({ padding: 1 });
  });
});
