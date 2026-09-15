import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { Platform, Pressable, ScrollView, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { ColorScheme } from '../../theme/types';
import { useTheme } from '../../hooks/useTheme';
import { useComponentDefaults, type Size } from '../../utils/variants';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';
import { webTransition } from '../../utils/motion';

export type TableVariant = 'simple' | 'striped' | 'outline';

interface TableContextValue {
  variant: TableVariant;
  size: Extract<Size, 'sm' | 'md' | 'lg'>;
  colorScheme: ColorScheme;
  isHoverable: boolean;
}
const TableContext = createContext<TableContextValue>({ variant: 'simple', size: 'md', colorScheme: 'neutral', isHoverable: false });
const RowContext = createContext<{ index: number; isHeader: boolean }>({ index: 0, isHeader: false });

export interface TableColumn<Row> {
  key: string;
  header: React.ReactNode;
  /** Render a cell; defaults to `row[key]`. */
  render?: (row: Row, index: number) => React.ReactNode;
  /** Fixed width in px; otherwise columns share space with `flex`. */
  width?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<Row = any> {
  children?: React.ReactNode;
  variant?: TableVariant;
  size?: Extract<Size, 'sm' | 'md' | 'lg'>;
  colorScheme?: ColorScheme;
  /** Highlight rows on hover (web). */
  isHoverable?: boolean;
  /** Data-driven mode: columns + rows, no children needed. */
  columns?: TableColumn<Row>[];
  data?: Row[];
  /** Key extractor for `data` rows. Default: `row.id ?? index`. */
  rowKey?: (row: Row, index: number) => string | number;
  onRowPress?: (row: Row, index: number) => void;
  /** Caption rendered above the table. */
  caption?: React.ReactNode;
  /** Minimum table width; enables horizontal scrolling when narrower. */
  minWidth?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const CELL_PAD: Record<'sm' | 'md' | 'lg', { px: number; py: number; font: Size }> = {
  sm: { px: 2, py: 1.5, font: 'sm' },
  md: { px: 3, py: 2.5, font: 'sm' },
  lg: { px: 4, py: 3, font: 'md' },
};

function TableRoot<Row = any>(rawProps: TableProps<Row>) {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Table', rawProps);
  const { children, variant = 'simple', size = 'md', colorScheme = 'neutral', isHoverable = false, columns, data, rowKey, onRowPress, caption, minWidth, style, testID } = props;
  const ctx = useMemo(() => ({ variant, size, colorScheme, isHoverable }), [variant, size, colorScheme, isHoverable]);

  const body =
    columns && data ? (
      <>
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableHeaderCell key={c.key} width={c.width} flex={c.flex} align={c.align}>
                {c.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={rowKey ? rowKey(row, i) : ((row as any)?.id ?? i)} onPress={onRowPress ? () => onRowPress(row, i) : undefined}>
              {columns.map((c) => (
                <TableCell key={c.key} width={c.width} flex={c.flex} align={c.align}>
                  {c.render ? c.render(row, i) : ((row as any)?.[c.key] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </>
    ) : (
      children
    );

  const table =
    variant === 'outline' ? (
      <Surface
        accessibilityRole={Platform.OS === 'web' ? ('table' as any) : undefined}
        variant="plain"
        shadow="none"
        rounded="lg"
        style={[{ minWidth, overflow: 'hidden' }, style]}
        testID={testID}
      >
        {body}
      </Surface>
    ) : (
      <View accessibilityRole={Platform.OS === 'web' ? ('table' as any) : undefined} style={[{ minWidth }, style]} testID={testID}>
        {body}
      </View>
    );

  return (
    <TableContext.Provider value={ctx}>
      {caption ? (
        typeof caption === 'string' ? (
          <Text size="sm" color="textMuted" mb={2}>
            {caption}
          </Text>
        ) : (
          caption
        )
      ) : null}
      {minWidth ? (
        <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ flexGrow: 1 }}>
          {table}
        </ScrollView>
      ) : (
        table
      )}
    </TableContext.Provider>
  );
}
TableRoot.displayName = 'Table';

function TableHead({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return (
    <RowContext.Provider value={{ index: -1, isHeader: true }}>
      <View style={[{ backgroundColor: theme.colors.semantic.surfaceSubtle }, style]}>{children}</View>
    </RowContext.Provider>
  );
}
TableHead.displayName = 'Table.Head';

function TableBody({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const items = Array.isArray(children) ? children.flat() : [children];
  return (
    <View style={style}>
      {items.filter(Boolean).map((child, i) => (
        <RowContext.Provider key={(child as any)?.key ?? i} value={{ index: i, isHeader: false }}>
          {child as React.ReactNode}
        </RowContext.Provider>
      ))}
    </View>
  );
}
TableBody.displayName = 'Table.Body';

export interface TableRowProps {
  children?: React.ReactNode;
  onPress?: () => void;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function TableRow({ children, onPress, isSelected, style, testID }: TableRowProps) {
  const theme = useTheme();
  const { variant, isHoverable, colorScheme } = useContext(TableContext);
  const { index, isHeader } = useContext(RowContext);
  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.neutral;
  const dark = theme.mode === 'dark';
  const striped = variant === 'striped' && !isHeader && index % 2 === 1;
  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: isHeader || variant !== 'outline' ? theme.borderWidths.thin : theme.borderWidths.thin,
    borderColor: theme.colors.semantic.border,
    backgroundColor: isSelected ? (dark ? scale[900] : scale[50]) : striped ? theme.colors.semantic.surfaceSubtle : undefined,
    ...webTransition(theme, ['background-color'], 'fast'),
  };
  const interactive = !!onPress || (isHoverable && !isHeader);
  if (!interactive) {
    return (
      <View accessibilityRole={Platform.OS === 'web' ? ('row' as any) : undefined} style={[base, style]} testID={testID}>
        {children}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole={Platform.OS === 'web' ? ('row' as any) : 'button'}
      onPress={onPress}
      style={({ pressed, hovered }: any) => [
        base,
        pressed ? { backgroundColor: theme.colors.semantic.surfaceActive } : hovered ? { backgroundColor: theme.colors.semantic.surfaceHover } : null,
        Platform.OS === 'web' && onPress ? ({ cursor: 'pointer' } as ViewStyle) : null,
        style,
      ]}
      testID={testID}
    >
      {children}
    </Pressable>
  );
}
TableRow.displayName = 'Table.Row';

export interface TableCellProps {
  children?: React.ReactNode;
  width?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  /** Truncate text to one line. Default `true`. */
  truncate?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function TableCell({ children, width, flex, align = 'left', truncate = true, style, textStyle }: TableCellProps) {
  const theme = useTheme();
  const { size } = useContext(TableContext);
  const { isHeader } = useContext(RowContext);
  const pad = CELL_PAD[size];
  return (
    <View
      accessibilityRole={Platform.OS === 'web' ? ((isHeader ? 'columnheader' : 'cell') as any) : undefined}
      style={[
        {
          width,
          flex: width ? undefined : (flex ?? 1),
          paddingHorizontal: theme.spacing[pad.px as keyof typeof theme.spacing],
          paddingVertical: theme.spacing[pad.py as keyof typeof theme.spacing],
          alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        },
        style,
      ]}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text size={pad.font} weight={isHeader ? 'semibold' : 'normal'} color={isHeader ? 'textMuted' : 'text'} uppercase={isHeader} letterSpacing={isHeader ? 0.4 : undefined} truncate={truncate} align={align} style={textStyle}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
TableCell.displayName = 'Table.Cell';

function TableHeaderCell(props: TableCellProps) {
  return <TableCell {...props} />;
}
TableHeaderCell.displayName = 'Table.HeaderCell';

/**
 * Tabular data. Use compound parts (`Table.Head/Body/Row/Cell/HeaderCell`) or
 * pass `columns` + `data` for a quick data-driven table.
 */
export const Table = Object.assign(TableRoot, { Head: TableHead, Body: TableBody, Row: TableRow, Cell: TableCell, HeaderCell: TableHeaderCell });
