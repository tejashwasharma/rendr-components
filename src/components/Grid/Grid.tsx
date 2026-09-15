import React, { Children } from 'react';
import { View } from 'react-native';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { resolveResponsive, type Responsive } from '../../utils/styleProps';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useTheme } from '../../hooks/useTheme';
import { resolveSpace } from '../../utils/getToken';

export interface GridOwnProps extends BoxOwnProps {
  /** Number of columns. Responsive: `columns={[1, 2, 4]}`. Default `2`. */
  columns?: Responsive<number>;
  /** Gap between cells (theme spacing key or raw). Default `4`. */
  gap?: Responsive<number | string>;
  /** Override gap for rows / columns individually. */
  rowGap?: Responsive<number | string>;
  columnGap?: Responsive<number | string>;
}

export type GridProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, GridOwnProps>;

/**
 * A simple equal-width grid built with flex-wrap, so it works identically on
 * native and web. Each child is wrapped in a cell sized to `100% / columns`.
 */
export const Grid = forwardRefPolymorphic<typeof View, GridOwnProps>((props, ref) => {
  const { columns = 2, gap = 4, rowGap, columnGap, children, style, ...rest } = props;
  const theme = useTheme();
  const bp = useBreakpoint();
  const cols = Math.max(1, resolveResponsive(columns, bp) ?? 1);
  const colGapValue = resolveSpace(theme, resolveResponsive(columnGap ?? gap, bp)) ?? 0;
  const rowGapValue = resolveSpace(theme, resolveResponsive(rowGap ?? gap, bp)) ?? 0;
  const colGap = typeof colGapValue === 'number' ? colGapValue : 0;
  const rGap = typeof rowGapValue === 'number' ? rowGapValue : 0;

  const items = Children.toArray(children);
  return (
    <Box
      ref={ref}
      direction="row"
      wrap="wrap"
      style={[{ marginHorizontal: -colGap / 2, marginVertical: -rGap / 2 }, style]}
      {...(rest as object)}
    >
      {items.map((child, i) => (
        <View
          key={(React.isValidElement(child) && child.key) || i}
          style={{
            width: `${100 / cols}%`,
            paddingHorizontal: colGap / 2,
            paddingVertical: rGap / 2,
          }}
        >
          {child}
        </View>
      ))}
    </Box>
  );
}, 'Grid');
