import type React from 'react';
import { cloneElement, isValidElement } from 'react';
import { Animated, Platform, Pressable, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useTheme } from '../../hooks/useTheme';
import { useControllableState } from '../../hooks/useControllableState';
import { webTransition } from '../../utils/motion';
import { BREAKPOINT_ORDER } from '../../utils/styleProps';
import { useComponentDefaults } from '../../utils/variants';
import { Avatar } from '../Avatar/Avatar';
import { Menu } from '../Menu/Menu';
import { Surface } from '../Surface/Surface';
import { Text } from '../Text/Text';
import type { Breakpoint, ColorScheme, Theme } from '../../theme/types';

export interface NavItem {
  /** Stable identifier — pass your route name/key. */
  key: string;
  label: string;
  /** An icon element, e.g. from `lucide-react-native`. Cloned with `color`/`size`/`strokeWidth`. Ignored if `avatar` is set. */
  icon?: React.ReactElement;
  /** Render this item as a user avatar instead of `icon` — e.g. the profile tab. Same in both the top and bottom layouts. */
  avatar?: { src?: string; name?: string };
  /**
   * Pin this item to the right edge of the top bar (e.g. profile), while
   * everything else stays grouped on the left. It's still one of `items` —
   * tracked by the same sliding indicator and active/onChange state as any
   * other tab, just visually separated. Ignored at the bottom, where every
   * item already sits in a single row. Default `'start'`.
   */
  align?: 'start' | 'end';
  /**
   * Content for a dropdown menu — typically `Menu.Item`/`Menu.Divider`
   * elements. When set, pressing this item opens the menu instead of
   * navigating; it's excluded from the sliding indicator. The menu opens
   * below the item and automatically flips above (a "dropup") when there
   * isn't enough room below — e.g. a profile item on the bottom bar, which
   * sits near the bottom of the screen.
   */
  menu?: React.ReactNode;
  isDisabled?: boolean;
}

export type NavBarPlacement = 'auto' | 'top' | 'bottom';

export interface NavBarProps {
  items: NavItem[];
  /** Active item key (controlled). */
  value?: string;
  /** Active item key (uncontrolled). Defaults to the first item. */
  defaultValue?: string;
  onChange?: (key: string) => void;
  colorScheme?: ColorScheme;
  /** Breakpoint at/above which the bar docks to the top. Below it, it floats at the bottom. Default `'md'`. */
  topAt?: Breakpoint;
  /** Skip the breakpoint check and force one layout — mainly for tests/Storybook. Default `'auto'`. */
  placement?: NavBarPlacement;
  /** Left-side content in the top layout (logo, brand mark). Ignored at the bottom. */
  leading?: React.ReactNode;
  /** Right-side content in the top layout (search, avatar, actions). Ignored at the bottom. */
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Primary app navigation. Docks to the top as a horizontal bar on wide
 * viewports (desktop, a tablet in landscape) and floats as a bottom pill on
 * narrow ones (phone, a tablet in portrait) — the same `items` drive both.
 *
 * The placement check is width-based (`useBreakpoint`), which is exactly
 * what changes when a tablet rotates — no separate orientation check needed.
 *
 * `NavBar` only renders; it doesn't know about your router. Map the active
 * route to `value` (or leave it uncontrolled) and navigate from `onChange`.
 */
export function NavBar(rawProps: NavBarProps) {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'NavBar', rawProps);
  const {
    items,
    value,
    defaultValue,
    onChange,
    colorScheme = 'primary',
    topAt = 'md',
    placement = 'auto',
    leading,
    trailing,
    style,
    testID,
  } = props;

  const breakpoint = useBreakpoint();
  const [current, setValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? items[0]?.key ?? '',
    onChange,
  });
  const indicator = useSlidingIndicator(current);

  const top =
    placement === 'auto'
      ? BREAKPOINT_ORDER.indexOf(breakpoint) >= BREAKPOINT_ORDER.indexOf(topAt)
      : placement === 'top';

  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.primary;
  const dark = theme.mode === 'dark';
  const accent = scale[dark ? 400 : 600];

  function press(item: NavItem) {
    if (item.isDisabled) return;
    setValue(item.key);
  }

  const indicatorStyle = [
    indicator.style,
    {
      opacity: indicator.ready ? 1 : 0,
      borderRadius: theme.radii.full,
      // The bottom pill floats over a translucent surface and reads best a
      // touch stronger than the inline highlight docked into a solid bar.
      backgroundColor: `${accent}${top ? '14' : '26'}`,
    },
  ];

  function button(item: NavItem) {
    if (item.menu) {
      // A menu trigger isn't a navigable tab — it doesn't join the sliding
      // indicator, and pressing it opens the dropdown instead of `onChange`.
      return <NavBarMenuButton key={item.key} item={item} top={top} accent={accent} />;
    }
    return (
      <NavBarButton
        key={item.key}
        item={item}
        focused={item.key === current}
        top={top}
        accent={accent}
        onPress={() => press(item)}
        onLayout={indicator.register(item.key)}
      />
    );
  }

  if (top) {
    // Right-aligned items (e.g. profile) stay in the same row as everything
    // else — they're siblings of the left items, just after a flexible
    // spacer — so the shared sliding indicator's layout math keeps working
    // no matter which one is active.
    const startItems = items.filter((item) => item.align !== 'end');
    const endItems = items.filter((item) => item.align === 'end');

    return (
      <Surface
        variant="sheet"
        rounded="none"
        shadow="sm"
        testID={testID}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing[4],
            paddingVertical: 5,
            zIndex: theme.zIndices.sticky,
          },
          style,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>{leading}</View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', position: 'relative', marginHorizontal: theme.spacing[6] }}>
          <Animated.View pointerEvents="none" style={indicatorStyle} />
          {/* Two equal spacers straddle the start items, centering them in
              the space left of the right-pinned (`align: 'end'`) items. */}
          <View style={{ flex: 1 }} />
          {startItems.map(button)}
          <View style={{ flex: 1 }} />
          {endItems.map(button)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>{trailing}</View>
      </Surface>
    );
  }

  const list = items.map(button);

  return (
    <Surface
      variant="sheet"
      rounded="full"
      shadow="lg"
      testID={testID}
      style={[
        {
          position: 'absolute',
          left: theme.spacing[5],
          right: theme.spacing[5],
          bottom: theme.spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 5,
          paddingHorizontal: theme.spacing[2],
          zIndex: theme.zIndices.sticky,
        },
        style,
      ]}
    >
      <Animated.View pointerEvents="none" style={indicatorStyle} />
      {list}
    </Surface>
  );
}
NavBar.displayName = 'NavBar';

/** Icon/avatar + label for an item — shared by the plain and menu-trigger buttons. */
function navItemVisual(item: NavItem, focused: boolean, top: boolean, accent: string, theme: Theme) {
  const iconEl = item.avatar ? (
    <Avatar src={item.avatar.src} name={item.avatar.name} size="xs" showBorder={focused} borderColor={accent} />
  ) : item.icon && isValidElement(item.icon) ? (
    cloneElement(item.icon as React.ReactElement<any>, {
      color: focused ? accent : theme.colors.semantic.textMuted,
      size: 22,
      strokeWidth: focused ? 2.5 : 2,
    })
  ) : null;

  // The bottom bar is a narrow floating pill — only the focused label earns
  // its keep. The top bar has room, so every label stays visible.
  const showLabel = top || focused;

  return { iconEl, showLabel };
}

function navButtonStyle(item: NavItem, top: boolean, theme: Theme): StyleProp<ViewStyle> {
  return [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[top ? 4 : 3.5],
      paddingVertical: theme.spacing[top ? 2.5 : 2],
      opacity: item.isDisabled ? theme.opacity.disabled : 1,
      ...webTransition(theme, ['opacity'], 'fast'),
      ...(Platform.OS === 'web' ? ({ cursor: item.isDisabled ? 'not-allowed' : 'pointer' } as ViewStyle) : null),
    },
  ];
}

function NavBarButton({
  item,
  focused,
  top,
  accent,
  onPress,
  onLayout,
}: {
  item: NavItem;
  focused: boolean;
  top: boolean;
  accent: string;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const theme = useTheme();
  const { iconEl, showLabel } = navItemVisual(item, focused, top, accent, theme);

  return (
    <Pressable
      accessibilityRole={Platform.OS === 'web' ? ('link' as any) : 'button'}
      accessibilityState={{ selected: focused, disabled: !!item.isDisabled }}
      disabled={item.isDisabled}
      onPress={onPress}
      onLayout={onLayout}
      style={navButtonStyle(item, top, theme)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1.5] }}>
        {iconEl}
        {showLabel ? (
          <Text size="sm" weight={focused ? 'semibold' : 'medium'} color={focused ? accent : 'textMuted'} numberOfLines={1}>
            {item.label}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function NavBarMenuButton({ item, top, accent }: { item: NavItem; top: boolean; accent: string }) {
  const theme = useTheme();
  const { iconEl, showLabel } = navItemVisual(item, false, top, accent, theme);

  return (
    <Menu placement={item.align === 'end' ? 'bottom-end' : 'bottom-start'}>
      <Menu.Trigger>
        <Pressable
          accessibilityRole={Platform.OS === 'web' ? ('button' as any) : 'button'}
          disabled={item.isDisabled}
          style={navButtonStyle(item, top, theme)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1.5] }}>
            {iconEl}
            {showLabel ? (
              <Text size="sm" weight="medium" color="textMuted" numberOfLines={1}>
                {item.label}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Menu.Trigger>
      <Menu.List>{item.menu}</Menu.List>
    </Menu>
  );
}
