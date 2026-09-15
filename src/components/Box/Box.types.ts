import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { StyleProps } from '../../utils/styleProps';

export interface BoxOwnProps extends StyleProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
