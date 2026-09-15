import type React from 'react';
import { Children, createContext, isValidElement, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, View, type LayoutChangeEvent, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator';
import { resolveShadow } from '../../utils/shadow';
import { webTransition } from '../../utils/motion';
import { Surface } from '../Surface/Surface';
import type { ColorScheme } from '../../theme/types';
import { useTheme } from '../../hooks/useTheme';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { useComponentDefaults, type Size } from '../../utils/variants';
import { Text } from '../Text/Text';

export type TabsVariant = 'line' | 'enclosed' | 'pills' | 'soft';

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  variant: TabsVariant;
  size: Size;
  colorScheme: ColorScheme;
  isFitted: boolean;
  isLazy: boolean;
  orientation: 'horizontal' | 'vertical';
  id: string;
  register: (v: string) => number;
  order: React.MutableRefObject<string[]>;
  registerLayout: (v: string) => (e: LayoutChangeEvent) => void;
}
const TabsContext = createContext<TabsContextValue | undefined>(undefined);
const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound components must be used inside <Tabs>.');
  return ctx;
};

export interface TabsProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: Size;
  colorScheme?: ColorScheme;
  /** Tabs stretch to fill the list width. */
  isFitted?: boolean;
  /** Render a panel only once it has been activated. Default `false`. */
  isLazy?: boolean;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function TabsRoot(rawProps: TabsProps) {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Tabs', rawProps);
  const { children, value, defaultValue, onChange, variant = 'line', size = 'md', colorScheme = 'primary', isFitted = false, isLazy = false, orientation = 'horizontal', style, testID } = props;
  const order = useRef<string[]>([]);
  const [current, setValue] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange });
  const id = useId('tabs');
  const indicator = useSlidingIndicator(current);
  const ctx = useMemo<TabsContextValue>(
    () => ({
      value: current,
      setValue,
      variant,
      size,
      colorScheme,
      isFitted,
      isLazy,
      orientation,
      id,
      order,
      register: (v) => {
        if (!order.current.includes(v)) order.current.push(v);
        return order.current.indexOf(v);
      },
      registerLayout: indicator.register,
    }),
    [current, setValue, variant, size, colorScheme, isFitted, isLazy, orientation, id, indicator.register],
  );
  return (
    <TabsContext.Provider value={ctx}>
      <IndicatorContext.Provider value={indicator}>
      <View style={[orientation === 'vertical' ? { flexDirection: 'row' } : null, style]} testID={testID}>
        {children}
      </View>
      </IndicatorContext.Provider>
    </TabsContext.Provider>
  );
}
TabsRoot.displayName = 'Tabs';

const IndicatorContext = createContext<ReturnType<typeof useSlidingIndicator> | undefined>(undefined);

/** The pill / underline that slides to the selected tab. */
function TabIndicator() {
  const theme = useTheme();
  const { variant, colorScheme, orientation } = useTabs();
  const ind = useContext(IndicatorContext);
  if (!ind) return null;
  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.primary;
  const dark = theme.mode === 'dark';
  const accent = scale[dark ? 400 : 600];
  const vertical = orientation === 'vertical';
  let look: ViewStyle;
  switch (variant) {
    case 'line':
      look = vertical
        ? { width: 2, backgroundColor: accent, left: undefined, right: -1 }
        : { height: 2, backgroundColor: accent, top: undefined, bottom: -1 };
      break;
    case 'enclosed':
      look = { borderRadius: theme.radii.md, backgroundColor: theme.colors.semantic.surface, borderWidth: theme.borderWidths.thin, borderColor: theme.colors.semantic.border, ...resolveShadow(theme, 'sm') };
      break;
    case 'pills':
      look = { borderRadius: theme.radii.full, backgroundColor: accent };
      break;
    case 'soft':
    default:
      look = { borderRadius: theme.radii.md, backgroundColor: dark ? scale[900] : scale[50] };
      break;
  }
  const s: any = { ...ind.style, opacity: ind.ready ? 1 : 0 };
  if (variant === 'line') {
    // Underline only needs the cross-axis size from the tab; keep the line thin.
    if (vertical) { s.width = 2; s.transform = [{ translateX: 0 }, s.transform[1]]; s.left = undefined; s.right = -1; }
    else { s.height = 2; s.transform = [s.transform[0], { translateY: 0 }]; s.top = undefined; s.bottom = -1; }
  }
  return <Animated.View pointerEvents="none" style={[s, look]} />;
}

export interface TabListProps {
  children?: React.ReactNode;
  /** Allow horizontal scrolling when tabs overflow. Default `true` unless `isFitted`. */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

function TabList({ children, scrollable, style }: TabListProps) {
  const theme = useTheme();
  const { variant, isFitted, orientation, setValue, value, order } = useTabs();
  const vertical = orientation === 'vertical';
  const lineStyle: ViewStyle =
    variant === 'line'
      ? vertical
        ? { borderRightWidth: theme.borderWidths.thin, borderColor: theme.colors.semantic.border }
        : { borderBottomWidth: theme.borderWidths.thin, borderColor: theme.colors.semantic.border }
      : variant === 'enclosed'
        ? { padding: theme.spacing[1] }
        : {};

  // Arrow-key navigation on web.
  const onKeyDown = Platform.OS === 'web'
    ? (e: any) => {
        const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
        const idx = order.current.indexOf(value);
        if (idx < 0) return;
        if (e.key === keys[0]) setValue(order.current[(idx - 1 + order.current.length) % order.current.length]);
        else if (e.key === keys[1]) setValue(order.current[(idx + 1) % order.current.length]);
        else if (e.key === 'Home') setValue(order.current[0]);
        else if (e.key === 'End') setValue(order.current[order.current.length - 1]);
        else return;
        e.preventDefault?.();
      }
    : undefined;

  const Container: React.ElementType = variant === 'enclosed' ? Surface : View;
  const containerProps = variant === 'enclosed' ? { variant: 'subtle', shadow: 'none', rounded: 'lg' } : {};
  const row = (
    <Container
      accessibilityRole={Platform.OS === 'web' ? ('tablist' as any) : undefined}
      {...containerProps}
      {...(onKeyDown ? { onKeyDown } : {})}
      style={[{ flexDirection: vertical ? 'column' : 'row', alignItems: isFitted ? 'stretch' : undefined, position: 'relative' }, lineStyle, style]}
    >
      <TabIndicator />
      {children}
    </Container>
  );
  const canScroll = scrollable ?? (!isFitted && !vertical);
  return canScroll ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      {row}
    </ScrollView>
  ) : (
    row
  );
}
TabList.displayName = 'Tabs.List';

export interface TabProps extends Omit<PressableProps, 'style' | 'children'> {
  value: string;
  children?: React.ReactNode;
  isDisabled?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  style?: StyleProp<ViewStyle>;
}

const TAB_SIZES: Record<Size, { px: number; py: number; font: Size }> = {
  xs: { px: 2, py: 1, font: 'xs' },
  sm: { px: 3, py: 1.5, font: 'sm' },
  md: { px: 4, py: 2, font: 'md' },
  lg: { px: 5, py: 2.5, font: 'lg' },
  xl: { px: 6, py: 3, font: 'xl' },
};

function Tab({ value, children, isDisabled, leftIcon, rightIcon, style, onPress, ...rest }: TabProps) {
  const theme = useTheme();
  const { value: current, setValue, variant, size, colorScheme, isFitted, orientation, id, register, registerLayout } = useTabs();
  register(value);
  const [hovered, setHovered] = useState(false);
  const selected = current === value;
  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.primary;
  const dark = theme.mode === 'dark';
  const accent = scale[dark ? 400 : 600];
  const s = TAB_SIZES[size];
  const vertical = orientation === 'vertical';

  // The selected background/underline is drawn by the sliding <TabIndicator />;
  // tabs only change text colour and a hover tint.
  let container: ViewStyle = {};
  let textColor = selected ? (variant === 'pills' ? theme.colors.semantic.white : accent) : theme.colors.semantic.textMuted;
  switch (variant) {
    case 'line':
      container = vertical ? { marginRight: -1 } : { marginBottom: -1 };
      if (hovered && !selected) textColor = theme.colors.semantic.text;
      break;
    case 'enclosed':
      container = { borderRadius: theme.radii.md, backgroundColor: hovered && !selected ? theme.colors.semantic.surfaceHover : 'transparent' };
      textColor = selected ? theme.colors.semantic.text : theme.colors.semantic.textMuted;
      break;
    case 'pills':
      container = { borderRadius: theme.radii.full, backgroundColor: hovered && !selected ? theme.colors.semantic.surfaceHover : 'transparent' };
      break;
    case 'soft':
      container = { borderRadius: theme.radii.md, backgroundColor: hovered && !selected ? theme.colors.semantic.surfaceHover : 'transparent' };
      break;
  }
  void dark;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected, disabled: !!isDisabled }}
      nativeID={`${id}-tab-${value}`}
      aria-controls={`${id}-panel-${value}`}
      disabled={isDisabled}
      onPress={(e) => {
        onPress?.(e);
        setValue(value);
      }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onLayout={registerLayout(value)}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[2],
          ...webTransition(theme, ['background-color'], 'fast'),
          paddingHorizontal: theme.spacing[s.px as keyof typeof theme.spacing],
          paddingVertical: theme.spacing[s.py as keyof typeof theme.spacing],
          flex: isFitted && !vertical ? 1 : undefined,
          opacity: isDisabled ? theme.opacity.disabled : 1,
          ...(Platform.OS === 'web' ? ({ cursor: isDisabled ? 'not-allowed' : 'pointer', userSelect: 'none' } as ViewStyle) : null),
        },
        container,
        style,
      ]}
      {...rest}
    >
      {leftIcon}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text size={s.font} weight={selected ? 'semibold' : 'medium'} color={textColor}>
          {children}
        </Text>
      ) : (
        children
      )}
      {rightIcon}
    </Pressable>
  );
}
Tab.displayName = 'Tabs.Tab';

function TabPanels({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { orientation } = useTabs();
  return <View style={[orientation === 'vertical' ? { flex: 1 } : null, style]}>{Children.toArray(children).filter(isValidElement)}</View>;
}
TabPanels.displayName = 'Tabs.Panels';

export interface TabPanelProps {
  value: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function TabPanel({ value, children, style, testID }: TabPanelProps) {
  const theme = useTheme();
  const { value: current, isLazy, id } = useTabs();
  const activated = useRef(false);
  const selected = current === value;
  if (selected) activated.current = true;
  if (!selected) {
    // Lazy panels mount on first activation; afterwards every panel stays
    // mounted but hidden so its state persists across tab switches.
    if (isLazy && !activated.current) return null;
    return (
      <View style={{ display: 'none' }} nativeID={`${id}-panel-${value}`} testID={testID}>
        {children}
      </View>
    );
  }
  return (
    <View
      accessibilityRole={Platform.OS === 'web' ? ('tabpanel' as any) : undefined}
      nativeID={`${id}-panel-${value}`}
      aria-labelledby={`${id}-tab-${value}`}
      style={[{ paddingTop: theme.spacing[4] }, style]}
      testID={testID}
    >
      {children}
    </View>
  );
}
TabPanel.displayName = 'Tabs.Panel';

/**
 * Tabbed navigation. Compose: `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panels`,
 * `Tabs.Panel`. Panels stay mounted (hidden) unless `isLazy`.
 */
export const Tabs = Object.assign(TabsRoot, { List: TabList, Tab, Panels: TabPanels, Panel: TabPanel });
