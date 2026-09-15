import type React from 'react';
import { cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import { useTheme } from '../../hooks/useTheme';
import { useComponentDefaults } from '../../utils/variants';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Popover, type PopoverPlacement } from '../Popover/Popover';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';

export interface TooltipProps {
  /** Tooltip content. Strings get default styling; nodes render as-is. */
  label: React.ReactNode;
  /** The element that triggers the tooltip. */
  children: React.ReactElement;
  placement?: PopoverPlacement;
  /** Delay before showing on hover (web) in ms. Default `300`. */
  openDelay?: number;
  closeDelay?: number;
  /** Controlled open state. */
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  isDisabled?: boolean;
  /** Show on press instead of long-press on native. Default `false`. */
  showOnPress?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Contextual hint. Shows on hover/focus on web, and on long-press on native
 * (there is no hover on touch screens).
 */
export function Tooltip(rawProps: TooltipProps) {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Tooltip', rawProps);
  const {
    label,
    children,
    placement = 'top',
    openDelay = 300,
    closeDelay = 100,
    isOpen: isOpenProp,
    defaultIsOpen,
    onOpen,
    onClose,
    isDisabled,
    showOnPress = false,
    contentStyle,
    testID,
  } = props;
  const anchorRef = useRef<ViewRef | null>(null);
  const { isOpen, open, close } = useDisclosure({ isOpen: isOpenProp, defaultIsOpen, onOpen, onClose });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pressedOpen, setPressedOpen] = useState(false);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => clear, []);

  const show = useCallback(() => {
    if (isDisabled) return;
    clear();
    timer.current = setTimeout(open, openDelay);
  }, [isDisabled, open, openDelay]);
  const hide = useCallback(() => {
    clear();
    timer.current = setTimeout(close, closeDelay);
  }, [close, closeDelay]);

  if (!isValidElement(children)) return children;
  const childProps = children.props as Record<string, any>;

  // Web: hover + focus. Native: long press (or press).
  const triggerProps =
    Platform.OS === 'web'
      ? {
          onHoverIn: (e: any) => {
            childProps.onHoverIn?.(e);
            show();
          },
          onHoverOut: (e: any) => {
            childProps.onHoverOut?.(e);
            hide();
          },
          onFocus: (e: any) => {
            childProps.onFocus?.(e);
            show();
          },
          onBlur: (e: any) => {
            childProps.onBlur?.(e);
            hide();
          },
        }
      : showOnPress
        ? {
            onPress: (e: any) => {
              childProps.onPress?.(e);
              setPressedOpen(true);
              open();
            },
          }
        : {
            onLongPress: (e: any) => {
              childProps.onLongPress?.(e);
              setPressedOpen(true);
              open();
            },
            onPressOut: (e: any) => {
              childProps.onPressOut?.(e);
              if (pressedOpen) {
                setPressedOpen(false);
                hide();
              }
            },
          };

  const content =
    typeof label === 'string' || typeof label === 'number' ? (
      <Text size="sm">{label}</Text>
    ) : (
      label
    );

  return (
    <>
      <View ref={anchorRef} collapsable={false} style={{ alignSelf: 'flex-start' }}>
        {cloneElement(children as React.ReactElement<any>, { ...triggerProps, accessibilityHint: typeof label === 'string' ? label : childProps.accessibilityHint })}
      </View>
      <Popover
        isOpen={isOpen && !isDisabled}
        onClose={close}
        anchorRef={anchorRef}
        placement={placement}
        mode="anchored"
        pointerEventsNone
        closeOnBackdropPress={false}
        testID={testID}
        contentStyle={[{ maxWidth: 280 }, contentStyle]}
      >
        <Surface
          accessibilityRole={Platform.OS === 'web' ? ('tooltip' as any) : undefined}
          shadow="sm"
          rounded="md"
          style={{ paddingHorizontal: theme.spacing[2.5], paddingVertical: theme.spacing[1.5] }}
        >
          {content}
        </Surface>
      </Popover>
    </>
  );
}
Tooltip.displayName = 'Tooltip';

/** Convenience wrapper: a pressable area with a tooltip, for non-interactive children. */
export function TooltipTrigger({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <Pressable style={style}>{children}</Pressable>;
}
