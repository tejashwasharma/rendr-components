import React from 'react';
import type { View } from 'react-native';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';

export interface FlexOwnProps extends BoxOwnProps {
  /** Shortcut for `align="center"` + `justify="center"`. */
  center?: boolean;
  /** Renders children inline (`flexDirection: row`). Default `true`. */
  inline?: boolean;
}

export type FlexProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, FlexOwnProps>;

/** A `Box` with `display: flex` and row direction by default. */
export const Flex = forwardRefPolymorphic<typeof View, FlexOwnProps>((props, ref) => {
  const { center, inline = true, direction, align, justify, ...rest } = props;
  return (
    <Box
      ref={ref}
      direction={direction ?? (inline ? 'row' : 'column')}
      align={align ?? (center ? 'center' : undefined)}
      justify={justify ?? (center ? 'center' : undefined)}
      {...(rest as object)}
    />
  );
}, 'Flex');
