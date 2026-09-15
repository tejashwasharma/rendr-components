import React, { Children, Fragment, isValidElement } from 'react';
import type { View } from 'react-native';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import type { Responsive } from '../../utils/styleProps';

export interface StackOwnProps extends BoxOwnProps {
  /** Layout direction. Default `'column'`. */
  direction?: Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  /** Space between children (theme spacing key or raw value). Default `2`. */
  spacing?: Responsive<number | string>;
  /** Element rendered between children. */
  divider?: React.ReactElement;
  /** Horizontal shorthand for `direction="row"`. */
  horizontal?: boolean;
}

export type StackProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, StackOwnProps>;

/** Lays out children in a column (or row) with consistent spacing. */
export const Stack = forwardRefPolymorphic<typeof View, StackOwnProps>((props, ref) => {
  const { direction, spacing = 2, divider, horizontal, children, gap, ...rest } = props;
  const dir = direction ?? (horizontal ? 'row' : 'column');

  let content: React.ReactNode = children;
  if (divider) {
    const items = Children.toArray(children).filter(isValidElement);
    content = items.map((child, i) => (
      <Fragment key={child.key ?? i}>
        {child}
        {i < items.length - 1 ? divider : null}
      </Fragment>
    ));
  }

  return (
    <Box ref={ref} direction={dir} gap={gap ?? spacing} {...(rest as object)}>
      {content}
    </Box>
  );
}, 'Stack');

/** Horizontal `Stack` with vertically centered children. */
export const HStack = forwardRefPolymorphic<typeof View, StackOwnProps>(
  (props, ref) => <Stack ref={ref} direction="row" align="center" {...(props as object)} />,
  'HStack',
);

/** Vertical `Stack`. */
export const VStack = forwardRefPolymorphic<typeof View, StackOwnProps>(
  (props, ref) => <Stack ref={ref} direction="column" {...(props as object)} />,
  'VStack',
);
