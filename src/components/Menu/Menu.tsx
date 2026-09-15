import type React from 'react';
import { cloneElement, createContext, isValidElement, useContext, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import type { ColorScheme } from '../../theme/types';
import { useTheme } from '../../hooks/useTheme';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useComponentDefaults } from '../../utils/variants';
import { Popover, type PopoverPlacement } from '../Popover/Popover';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';
import { webTransition } from '../../utils/motion';

interface MenuContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  anchorRef: React.RefObject<ViewRef | null>;
  closeOnSelect: boolean;
  placement: PopoverPlacement;
  mode?: 'anchored' | 'sheet';
}
const MenuContext = createContext<MenuContextValue | undefined>(undefined);
export const useMenuContext = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('Menu compound components must be used inside <Menu>.');
  return ctx;
};

export interface MenuProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  /** Close the menu after an item is selected. Default `true`. */
  closeOnSelect?: boolean;
  /** Placement of the list relative to the trigger (anchored mode). Default `'bottom-start'`. */
  placement?: PopoverPlacement;
  /** Force anchored (dropdown) or sheet presentation. Default: anchored on web, sheet on native. */
  mode?: 'anchored' | 'sheet';
}

function MenuRoot(rawProps: MenuProps) {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Menu', rawProps);
  const { children, isOpen: isOpenProp, defaultIsOpen, onOpen, onClose, closeOnSelect = true, placement = 'bottom-start', mode } = props;
  const disclosure = useDisclosure({ isOpen: isOpenProp, defaultIsOpen, onOpen, onClose });
  const anchorRef = useRef<ViewRef | null>(null);
  const ctx = useMemo(
    () => ({ ...disclosure, anchorRef, closeOnSelect, placement, mode }),
    [disclosure, closeOnSelect, placement, mode],
  );
  return <MenuContext.Provider value={ctx}>{children}</MenuContext.Provider>;
}
MenuRoot.displayName = 'Menu';

export interface MenuTriggerProps {
  /** A single pressable element; its `onPress` is extended to toggle the menu. */
  children: React.ReactElement;
  style?: StyleProp<ViewStyle>;
}

function MenuTrigger({ children, style }: MenuTriggerProps) {
  const { toggle, anchorRef, isOpen } = useMenuContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as Record<string, any>;
  return (
    <View ref={anchorRef} collapsable={false} style={[{ alignSelf: 'flex-start' }, style]}>
      {cloneElement(children as React.ReactElement<any>, {
        onPress: (e: any) => {
          childProps.onPress?.(e);
          toggle();
        },
        accessibilityState: { ...(childProps.accessibilityState ?? {}), expanded: isOpen },
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
      })}
    </View>
  );
}
MenuTrigger.displayName = 'Menu.Trigger';

export interface MenuListProps {
  children?: React.ReactNode;
  /** Min width of the dropdown. Default `200`. */
  minWidth?: number;
  maxHeight?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function MenuList({ children, minWidth = 200, maxHeight = 360, style, testID }: MenuListProps) {
  const theme = useTheme();
  const { isOpen, close, anchorRef, placement, mode } = useMenuContext();
  const resolvedMode = mode ?? (Platform.OS === 'web' ? 'anchored' : 'sheet');
  const sheet = resolvedMode === 'sheet';
  return (
    <Popover isOpen={isOpen} onClose={close} anchorRef={anchorRef} placement={placement} mode={resolvedMode} testID={testID}>
      {sheet ? (
        <View accessibilityRole={Platform.OS === 'web' ? ('menu' as any) : undefined} style={[{ paddingHorizontal: theme.spacing[2] }, style]}>
          <ScrollView style={{ maxHeight }} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      ) : (
        <Surface
          accessibilityRole={Platform.OS === 'web' ? ('menu' as any) : undefined}
          shadow="lg"
          rounded="lg"
          style={[{ minWidth, paddingVertical: theme.spacing[1] }, style]}
        >
          <ScrollView style={{ maxHeight }} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Surface>
      )}
    </Popover>
  );
}
MenuList.displayName = 'Menu.List';

export interface MenuItemProps extends Omit<PressableProps, 'style' | 'children'> {
  children?: React.ReactNode;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  /** Secondary text shown at the right edge (e.g. a shortcut). */
  command?: string;
  isDisabled?: boolean;
  /** Tints the label (e.g. `'danger'` for destructive actions). */
  colorScheme?: ColorScheme;
  /** Override the menu-level `closeOnSelect`. */
  closeOnSelect?: boolean;
  style?: StyleProp<ViewStyle>;
}

function MenuItem({ children, leftIcon, rightIcon, command, isDisabled, colorScheme, closeOnSelect, onPress, style, ...rest }: MenuItemProps) {
  const theme = useTheme();
  const { close, closeOnSelect: menuCloseOnSelect } = useMenuContext();
  const [hovered, setHovered] = useState(false);
  const scale = colorScheme ? theme.colors.palette[colorScheme] : undefined;
  const textColor = scale ? scale[theme.mode === 'dark' ? 300 : 600] : theme.colors.semantic.text;
  return (
    <Pressable
      accessibilityRole={Platform.OS === 'web' ? ('menuitem' as any) : 'button'}
      accessibilityState={{ disabled: !!isDisabled }}
      disabled={isDisabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={(e) => {
        onPress?.(e);
        if (closeOnSelect ?? menuCloseOnSelect) close();
      }}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[2.5],
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2.5],
          marginHorizontal: theme.spacing[1],
          borderRadius: theme.radii.md,
          backgroundColor: pressed ? theme.colors.semantic.surfaceActive : hovered ? theme.colors.semantic.surfaceHover : 'transparent',
          opacity: isDisabled ? theme.opacity.disabled : 1,
          ...(Platform.OS === 'web' ? ({ cursor: isDisabled ? 'not-allowed' : 'pointer' } as ViewStyle) : null),
          ...webTransition(theme, ['background-color'], 'fast'),
        },
        style,
      ]}
      {...rest}
    >
      {leftIcon}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text color={textColor} style={{ flex: 1 }}>
          {children}
        </Text>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {command ? (
        <Text size="xs" color="textMuted">
          {command}
        </Text>
      ) : null}
      {rightIcon}
    </Pressable>
  );
}
MenuItem.displayName = 'Menu.Item';

function MenuDivider({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return <View style={[{ height: theme.borderWidths.thin, backgroundColor: theme.colors.semantic.border, marginVertical: theme.spacing[1] }, style]} />;
}
MenuDivider.displayName = 'Menu.Divider';

function MenuGroup({ title, children }: { title?: string; children?: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View>
      {title ? (
        <Text size="xs" weight="semibold" color="textMuted" uppercase letterSpacing={0.5} style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[2], paddingBottom: theme.spacing[1] }}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
MenuGroup.displayName = 'Menu.Group';

/**
 * Dropdown menu. On web it anchors to the trigger; on native it presents as a
 * bottom sheet. Compose: `Menu`, `Menu.Trigger`, `Menu.List`, `Menu.Item`,
 * `Menu.Group`, `Menu.Divider`.
 */
export const Menu = Object.assign(MenuRoot, { Trigger: MenuTrigger, List: MenuList, Item: MenuItem, Divider: MenuDivider, Group: MenuGroup });
