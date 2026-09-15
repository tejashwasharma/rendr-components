import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, View, useWindowDimensions, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import { useTheme } from '../../hooks/useTheme';
import { Surface } from '../Surface/Surface';
import { webTransition } from '../../utils/motion';

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ref to the element the popover is anchored to. */
  anchorRef: React.RefObject<ViewRef | null>;
  children?: React.ReactNode;
  /** Preferred placement relative to the anchor. Default `'bottom-start'`. */
  placement?: PopoverPlacement;
  /** Gap between anchor and content in px. Default `6`. */
  offset?: number;
  /**
   * `'anchored'` positions the content next to the anchor; `'sheet'` slides it
   * from the bottom of the screen. Default: anchored on web, sheet on native.
   */
  mode?: 'anchored' | 'sheet';
  /** Backdrop closes the popover when pressed. Default `true`. */
  closeOnBackdropPress?: boolean;
  /** Dim the backdrop (sheet mode). Default `true` for sheet, `false` for anchored. */
  dimBackdrop?: boolean;
  /** Content is not interactive (tooltips). */
  pointerEventsNone?: boolean;
  /** Match the content width to the anchor width (selects). */
  matchAnchorWidth?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function measureAnchor(ref: React.RefObject<ViewRef | null>): Promise<AnchorRect | null> {
  return new Promise((resolve) => {
    const node = ref.current as unknown as { measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void } | null;
    if (!node?.measureInWindow) return resolve(null);
    node.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
  });
}

/**
 * Low-level floating layer used by Menu, Select and Tooltip. Renders inside a
 * transparent RN `Modal` so it floats above everything on native and web.
 */
export function Popover({
  isOpen,
  onClose,
  anchorRef,
  children,
  placement = 'bottom-start',
  offset = 6,
  mode = Platform.OS === 'web' ? 'anchored' : 'sheet',
  closeOnBackdropPress = true,
  dimBackdrop,
  pointerEventsNone,
  matchAnchorWidth,
  contentStyle,
  testID,
}: PopoverProps) {
  const theme = useTheme();
  const { width: winW, height: winH } = useWindowDimensions();
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setAnchor(null);
      setSize(null);
      return;
    }
    measureAnchor(anchorRef).then((rect) => {
      if (mounted.current) setAnchor(rect);
    });
  }, [isOpen, anchorRef, winW, winH]);

  // Esc closes on web.
  useEffect(() => {
    if (!isOpen || Platform.OS !== 'web' || typeof document === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
  }, []);

  if (!isOpen) return null;

  const dim = dimBackdrop ?? mode === 'sheet';
  const backdrop = (
    <Pressable
      accessibilityLabel="Close"
      accessibilityRole="button"
      onPress={closeOnBackdropPress ? onClose : undefined}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: dim ? theme.colors.semantic.overlay : 'transparent' }}
      pointerEvents={pointerEventsNone ? 'none' : 'auto'}
    />
  );

  let positioned: ViewStyle;
  if (mode === 'sheet') {
    positioned = {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: winH * 0.7,
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[6],
    };
  } else {
    const a = anchor ?? { x: 0, y: 0, width: 0, height: 0 };
    const w = size?.width ?? 0;
    const h = size?.height ?? 0;
    const [side, align] = placement.split('-') as [string, string | undefined];

    let top = 0;
    let left = 0;
    if (side === 'bottom' || side === 'top') {
      top = side === 'bottom' ? a.y + a.height + offset : a.y - h - offset;
      // Flip if it would overflow.
      if (side === 'bottom' && top + h > winH && a.y - h - offset >= 0) top = a.y - h - offset;
      if (side === 'top' && top < 0 && a.y + a.height + offset + h <= winH) top = a.y + a.height + offset;
      left = align === 'end' ? a.x + a.width - w : align === 'start' ? a.x : a.x + a.width / 2 - w / 2;
    } else {
      left = side === 'right' ? a.x + a.width + offset : a.x - w - offset;
      top = a.y + a.height / 2 - h / 2;
    }
    const pad = 8;
    left = Math.max(pad, Math.min(left, winW - w - pad));
    top = Math.max(pad, Math.min(top, winH - h - pad));

    positioned = {
      position: 'absolute',
      top,
      left,
      width: matchAnchorWidth ? a.width : undefined,
      opacity: anchor && size ? 1 : 0,
      transform: [{ translateY: anchor && size ? 0 : -6 }],
      ...webTransition(theme, ['opacity', 'transform'], 'normal'),
    };
  }

  return (
    <Modal transparent visible animationType={mode === 'sheet' ? 'slide' : 'none'} onRequestClose={onClose} statusBarTranslucent>
      {backdrop}
      {mode === 'sheet' ? (
        <Surface
          onLayout={onLayout}
          rounded={0}
          shadow="lg"
          bordered={false}
          style={[positioned, { borderTopLeftRadius: theme.radii.xl, borderTopRightRadius: theme.radii.xl }, contentStyle]}
          pointerEvents={pointerEventsNone ? 'none' : 'auto'}
          testID={testID}
        >
          {children}
        </Surface>
      ) : (
        <View onLayout={onLayout} style={[positioned, contentStyle]} pointerEvents={pointerEventsNone ? 'none' : 'auto'} testID={testID}>
          {children}
        </View>
      )}
    </Modal>
  );
}
Popover.displayName = 'Popover';
