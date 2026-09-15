import React from 'react';
import type { View } from 'react-native';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { useStyleProps } from '../../utils/styleProps';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { StyledBox } from './Box.styles';
import type { BoxOwnProps } from './Box.types';

export type BoxProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, BoxOwnProps>;

/**
 * The foundational layout primitive. Renders a `View` (or anything via `as`)
 * and accepts theme-aware style props like `p`, `bg`, `rounded`, `shadow`.
 */
export const Box = forwardRefPolymorphic<typeof View, BoxOwnProps>((props, ref) => {
  const { as, style, ...rest } = props;
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  return <StyledBox ref={ref} as={as} style={[sx, style]} {...(others as object)} />;
}, 'Box');
