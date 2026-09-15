import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { StyleProps } from '../../utils/styleProps';
import type { FontSizeToken, FontWeightToken } from '../../theme/types';

export interface TextOwnProps extends Omit<StyleProps, 'align'> {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  /** Font size token or raw number. Default `'md'`. */
  size?: FontSizeToken | number;
  /** Font weight token or raw value. */
  weight?: FontWeightToken | TextStyle['fontWeight'];
  /** Color token (`'primary.500'`, `'textMuted'`) or raw color. Default `'text'`. */
  color?: string;
  align?: TextStyle['textAlign'];
  /** Line height multiplier token (`'tight'`, `'normal'`) or raw number. */
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose' | number;
  /** Font family key (`'body' | 'heading' | 'mono'`) or a raw family name. */
  font?: 'body' | 'heading' | 'mono' | (string & {});
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  /** Truncate with an ellipsis after this many lines (`true` = 1). */
  truncate?: boolean | number;
  numberOfLines?: number;
  /** Letter spacing in px. */
  letterSpacing?: number;
  /** Whether the text is selectable by the user. */
  selectable?: boolean;
}
