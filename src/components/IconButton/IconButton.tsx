import React from 'react';
import type { Pressable } from 'react-native';
import { Button } from '../Button/Button';
import type { ButtonOwnProps } from '../Button/Button.types';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { useTheme } from '../../hooks/useTheme';
import { getButtonSizes } from '../Button/Button.styles';

export interface IconButtonOwnProps extends Omit<ButtonOwnProps, 'leftIcon' | 'rightIcon' | 'children' | 'loadingText' | 'isFullWidth' | 'accessibilityLabel'> {
  /** The icon element to render. */
  icon: React.ReactElement;
  /** Required: screen-reader label, since the button has no visible text. */
  accessibilityLabel: string;
  /** Makes the button circular. */
  isRound?: boolean;
}

export type IconButtonProps<C extends React.ElementType = typeof Pressable> = PolymorphicComponentProps<C, IconButtonOwnProps>;

/** A square (or round) button that holds a single icon. */
export const IconButton = forwardRefPolymorphic<typeof Pressable, IconButtonOwnProps>((props, ref) => {
  const { icon, isRound, size = 'md', rounded, style, ...rest } = props;
  const theme = useTheme();
  const { height } = getButtonSizes(theme)[size];
  return (
    <Button
      ref={ref}
      size={size}
      rounded={isRound ? 'full' : rounded}
      style={[{ width: height, paddingHorizontal: 0 }, style]}
      {...(rest as object)}
    >
      {icon}
    </Button>
  );
}, 'IconButton');
