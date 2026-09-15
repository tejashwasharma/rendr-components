import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, type LayoutChangeEvent } from 'react-native';
import { useTheme } from './useTheme';

export interface IndicatorLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Drives a single "pill" that slides to the selected item instead of each
 * item re-styling itself. Register every item's `onLayout`; the returned
 * `style` positions an absolutely placed `Animated.View`.
 */
export function useSlidingIndicator(activeKey: string | number | undefined) {
  const theme = useTheme();
  const layouts = useRef(new Map<string | number, IndicatorLayout>());
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;
  const h = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  const moveTo = useCallback(
    (key: string | number | undefined, animate: boolean) => {
      if (key === undefined) return;
      const l = layouts.current.get(key);
      if (!l) return;
      if (!animate) {
        x.setValue(l.x);
        y.setValue(l.y);
        w.setValue(l.width);
        h.setValue(l.height);
        return;
      }
      const cfg = { duration: theme.durations.normal, easing: Easing.bezier(...theme.easing.bezier), useNativeDriver: false };
      Animated.parallel([
        Animated.timing(x, { toValue: l.x, ...cfg }),
        Animated.timing(y, { toValue: l.y, ...cfg }),
        Animated.timing(w, { toValue: l.width, ...cfg }),
        Animated.timing(h, { toValue: l.height, ...cfg }),
      ]).start();
    },
    [x, y, w, h, theme.durations.normal, theme.easing.bezier],
  );

  const register = useCallback(
    (key: string | number) => (e: LayoutChangeEvent) => {
      const { x: lx, y: ly, width, height } = e.nativeEvent.layout;
      const prev = layouts.current.get(key);
      layouts.current.set(key, { x: lx, y: ly, width, height });
      if (key === activeKey) {
        // First placement is instant; later layout shifts (resize) animate.
        const first = !readyRef.current;
        moveTo(key, !first && !!prev);
        if (first) {
          readyRef.current = true;
          setReady(true);
        }
      }
    },
    [activeKey, moveTo],
  );

  useEffect(() => {
    moveTo(activeKey, readyRef.current);
  }, [activeKey, moveTo]);

  return {
    register,
    ready,
    style: { position: 'absolute' as const, left: 0, top: 0, transform: [{ translateX: x }, { translateY: y }], width: w, height: h },
  };
}
