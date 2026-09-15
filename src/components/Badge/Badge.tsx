import React from 'react';
import type { View, TextStyle } from 'react-native';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { getVariantColors, useComponentDefaults, type Size } from '../../utils/variants';
import type { ColorScheme, RadiiToken } from '../../theme/types';
import { useTheme } from '../../hooks/useTheme';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { Text } from '../Text/Text';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';

export interface BadgeOwnProps extends BoxOwnProps {
  variant?: BadgeVariant;
  colorScheme?: ColorScheme;
  /** Default `'sm'`. */
  size?: Extract<Size, 'xs' | 'sm' | 'md' | 'lg'>;
  /** Border radius token. Default `'sm'`; use `'full'` for a pill. */
  rounded?: RadiiToken | number;
  /** Icon placed before the label. */
  leftIcon?: React.ReactElement;
  /** Icon placed after the label. */
  rightIcon?: React.ReactElement;
  textStyle?: TextStyle;
  /** Uppercase label text. Default `true`. */
  uppercase?: boolean;
}

export type BadgeProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, BadgeOwnProps>;

const SIZES = {
  xs: { px: 1, py: 0, font: 'xs' as const, minH: 16 },
  sm: { px: 1.5, py: 0.5, font: 'xs' as const, minH: 20 },
  md: { px: 2, py: 0.5, font: 'sm' as const, minH: 24 },
  lg: { px: 2.5, py: 1, font: 'md' as const, minH: 28 },
};

/** A small label for statuses, counts and categories. */
export const Badge = forwardRefPolymorphic<typeof View, BadgeOwnProps>((rawProps, ref) => {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Badge', rawProps);
  const { variant = 'subtle', colorScheme = 'neutral', size = 'sm', rounded = 'sm', leftIcon, rightIcon, textStyle, uppercase = true, children, ...rest } = props;
  const colors = getVariantColors(theme, colorScheme, variant);
  const s = SIZES[size];
  return (
    <Box
      ref={ref}
      direction="row"
      align="center"
      alignSelf="flex-start"
      px={s.px}
      py={s.py}
      minH={s.minH}
      gap={1}
      rounded={rounded}
      bg={colors.bg}
      borderWidth={theme.borderWidths.thin}
      borderColor={colors.border}
      {...(rest as object)}
    >
      {leftIcon}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text size={s.font} weight="semibold" color={colors.text} uppercase={uppercase} letterSpacing={uppercase ? 0.4 : undefined} style={textStyle}>
          {children}
        </Text>
      ) : (
        children
      )}
      {rightIcon}
    </Box>
  );
}, 'Badge');
