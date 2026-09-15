import type React from 'react';
import { forwardRef, useMemo } from 'react';
import { Animated, Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator';
import { webTransition } from '../../utils/motion';
import type { ViewRef } from '../../utils/refs';
import type { ColorScheme } from '../../theme/types';
import { useTheme } from '../../hooks/useTheme';
import { useControllableState } from '../../hooks/useControllableState';
import { useComponentDefaults, getVariantColors, stateBg, type Size } from '../../utils/variants';
import { Text } from '../Text/Text';

export interface PaginationProps {
  /** Current page (1-based). */
  page?: number;
  defaultPage?: number;
  totalPages: number;
  onChange?: (page: number) => void;
  /** Pages shown on each side of the current page. Default `1`. */
  siblingCount?: number;
  /** Pages always shown at the start/end. Default `1`. */
  boundaryCount?: number;
  /** Show « first / last » buttons. Default `false`. */
  showFirstLast?: boolean;
  /** Show ‹ prev / next › buttons. Default `true`. */
  showPrevNext?: boolean;
  size?: Extract<Size, 'sm' | 'md' | 'lg'>;
  colorScheme?: ColorScheme;
  /** Style of the active page. Default `'solid'`. */
  variant?: 'solid' | 'outline' | 'subtle';
  isDisabled?: boolean;
  /** Custom labels for the control buttons. */
  labels?: Partial<Record<'first' | 'prev' | 'next' | 'last', string>>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type PaginationItem = { type: 'page'; page: number } | { type: 'ellipsis'; key: string };

/** Compute the visible items for a paginator (exported for custom renderers). */
export function getPaginationRange(page: number, totalPages: number, siblingCount = 1, boundaryCount = 1): PaginationItem[] {
  const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);
  const siblingsStart = Math.max(Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
  const siblingsEnd = Math.min(Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2), endPages.length > 0 ? endPages[0] - 2 : totalPages - 1);

  const items: PaginationItem[] = [];
  startPages.forEach((p) => items.push({ type: 'page', page: p }));
  if (siblingsStart > boundaryCount + 2) items.push({ type: 'ellipsis', key: 'start' });
  else if (boundaryCount + 1 < totalPages - boundaryCount) items.push({ type: 'page', page: boundaryCount + 1 });
  range(siblingsStart, siblingsEnd).forEach((p) => items.push({ type: 'page', page: p }));
  if (siblingsEnd < totalPages - boundaryCount - 1) items.push({ type: 'ellipsis', key: 'end' });
  else if (totalPages - boundaryCount > boundaryCount) items.push({ type: 'page', page: totalPages - boundaryCount });
  endPages.forEach((p) => items.push({ type: 'page', page: p }));

  // De-duplicate pages that overlap at small totals.
  const seen = new Set<number>();
  return items.filter((it) => (it.type === 'ellipsis' ? true : seen.has(it.page) ? false : (seen.add(it.page), true)));
}

const SIZES: Record<'sm' | 'md' | 'lg', { box: number; font: Size }> = { sm: { box: 30, font: 'sm' }, md: { box: 36, font: 'md' }, lg: { box: 44, font: 'lg' } };

/** Page navigation with sibling/boundary windows and ellipses. */
export const Pagination: React.ForwardRefExoticComponent<PaginationProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, PaginationProps>((rawProps, ref) => {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Pagination', rawProps);
  const {
    page: pageProp,
    defaultPage = 1,
    totalPages,
    onChange,
    siblingCount = 1,
    boundaryCount = 1,
    showFirstLast = false,
    showPrevNext = true,
    size = 'md',
    colorScheme = 'primary',
    variant = 'solid',
    isDisabled,
    labels,
    style,
    testID,
  } = props;
  const [page, setPage] = useControllableState<number>({ value: pageProp, defaultValue: defaultPage, onChange });
  const items = useMemo(() => getPaginationRange(page, totalPages, siblingCount, boundaryCount), [page, totalPages, siblingCount, boundaryCount]);
  const s = SIZES[size];
  const active = getVariantColors(theme, colorScheme, variant);
  const idle = getVariantColors(theme, 'neutral', 'ghost');
  const indicator = useSlidingIndicator(page);

  const go = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p));
    if (next !== page) setPage(next);
  };

  // The current page's background is the sliding pill; buttons only tint on hover.
  const Btn = ({ label, target, disabled, current, a11y, pageKey }: { label: React.ReactNode; target: number; disabled?: boolean; current?: boolean; a11y: string; pageKey?: number }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ disabled: !!(disabled || isDisabled), selected: !!current }}
      aria-current={current ? 'page' : undefined}
      disabled={disabled || isDisabled}
      onPress={() => go(target)}
      onLayout={pageKey !== undefined ? indicator.register(pageKey) : undefined}
      style={({ pressed, hovered }: any) => ({
        minWidth: s.box,
        height: s.box,
        paddingHorizontal: theme.spacing[2],
        borderRadius: theme.radii.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: current ? 'transparent' : stateBg(idle, { pressed, hovered }),
        opacity: disabled || isDisabled ? theme.opacity.disabled : 1,
        ...(Platform.OS === 'web' ? ({ cursor: disabled || isDisabled ? 'not-allowed' : 'pointer', userSelect: 'none' } as ViewStyle) : null),
        ...webTransition(theme, ['background-color', 'color'], 'fast'),
      })}
    >
      {typeof label === 'string' || typeof label === 'number' ? (
        <Text size={s.font} weight={current ? 'semibold' : 'medium'} color={current ? active.text : theme.colors.semantic.text}>
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  );

  return (
    <View ref={ref} accessibilityRole={Platform.OS === 'web' ? ('navigation' as any) : undefined} accessibilityLabel="Pagination" style={[{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1], position: 'relative' }, style]} testID={testID}>
      <Animated.View
        pointerEvents="none"
        style={[
          indicator.style,
          {
            opacity: indicator.ready ? 1 : 0,
            borderRadius: theme.radii.md,
            backgroundColor: active.bg,
            borderWidth: theme.borderWidths.thin,
            borderColor: active.border,
          },
        ]}
      />
      {showFirstLast ? <Btn label={labels?.first ?? '«'} target={1} disabled={page === 1} a11y="First page" /> : null}
      {showPrevNext ? <Btn label={labels?.prev ?? '‹'} target={page - 1} disabled={page === 1} a11y="Previous page" /> : null}
      {items.map((it) =>
        it.type === 'ellipsis' ? (
          <View key={it.key} style={{ minWidth: s.box, height: s.box, alignItems: 'center', justifyContent: 'center' }}>
            <Text color="textMuted">…</Text>
          </View>
        ) : (
          <Btn key={it.page} pageKey={it.page} label={String(it.page)} target={it.page} current={it.page === page} a11y={`Page ${it.page}`} />
        ),
      )}
      {showPrevNext ? <Btn label={labels?.next ?? '›'} target={page + 1} disabled={page === totalPages} a11y="Next page" /> : null}
      {showFirstLast ? <Btn label={labels?.last ?? '»'} target={totalPages} disabled={page === totalPages} a11y="Last page" /> : null}
    </View>
  );
});
Pagination.displayName = 'Pagination';
