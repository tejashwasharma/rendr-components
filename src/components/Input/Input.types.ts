import type { ReactElement } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import type { ColorScheme, RadiiToken } from '../../theme/types';
import type { Size } from '../../utils/variants';
import type { StyleProps } from '../../utils/styleProps';

export type InputVariant = 'outline' | 'filled' | 'flushed' | 'unstyled';

export interface InputOwnProps extends StyleProps, Omit<TextInputProps, 'style' | 'editable'> {
  /** Style applied to the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to the native text input. */
  inputStyle?: StyleProp<TextStyle>;
  variant?: InputVariant;
  size?: Size;
  /** Color scheme used for the focus ring. Default `'primary'`. */
  colorScheme?: ColorScheme;
  rounded?: RadiiToken | number;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  /** Element rendered inside the field on the left (icon, prefix). */
  leftElement?: ReactElement;
  /** Element rendered inside the field on the right (icon, button). */
  rightElement?: ReactElement;
  /** Stretch to fill the container width. Default `true`. */
  isFullWidth?: boolean;
}

export interface InputSizeConfig {
  height: number;
  paddingX: number;
  fontSize: number;
}
