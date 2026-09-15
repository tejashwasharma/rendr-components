import type { ReactElement, ReactNode } from 'react';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { ColorScheme, RadiiToken } from '../../theme/types';
import type { Size, Variant } from '../../utils/variants';
import type { StyleProps } from '../../utils/styleProps';

export interface ButtonOwnProps extends StyleProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Visual style. Default `'solid'`. Also accepts app-defined variants from `theme.components.Button.variants`. */
  variant?: Variant | (string & {});
  /** Size. Default `'md'`. */
  size?: Size;
  /** Palette color scheme. Default `'primary'`. */
  colorScheme?: ColorScheme;
  /** Border radius token. Default `'md'`. */
  rounded?: RadiiToken | number;
  /** Shows a spinner and disables interaction. */
  isLoading?: boolean;
  /** Text shown next to the spinner while loading. */
  loadingText?: string;
  /** Where to place the spinner. Default `'start'`. */
  spinnerPlacement?: 'start' | 'end';
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  /** Stretch to the container width. */
  isFullWidth?: boolean;
  isDisabled?: boolean;
  /** Same as `isDisabled`; provided for RN parity. */
  disabled?: boolean;
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  /** Style applied to the label text. */
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface ButtonSizeConfig {
  height: number;
  paddingX: number;
  fontSize: number;
  iconGap: number;
  spinner: number;
}
