import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

export interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: ToastStatus;
  /** Auto-dismiss after ms. `null` keeps it until closed. Default `4000`. */
  duration?: number | null;
  isClosable?: boolean;
  position?: ToastPosition;
  /** Custom content; replaces title/description. Receives `onClose`. */
  render?: (props: { onClose: () => void; id: string }) => React.ReactNode;
  /** Action button rendered at the right. */
  action?: { label: string; onPress: () => void };
  onCloseComplete?: () => void;
}

export type ToastInstance = Omit<ToastOptions, 'id' | 'status' | 'duration' | 'isClosable' | 'position'> & {
  id: string;
  status: ToastStatus;
  duration: number | null;
  isClosable: boolean;
  position: ToastPosition;
};

export interface ToastApi {
  (options: ToastOptions): string;
  close: (id: string) => void;
  closeAll: () => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
  isActive: (id: string) => boolean;
}

const ToastContext = createContext<ToastApi | undefined>(undefined);

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Default position for toasts. Default `'top'`. */
  defaultPosition?: ToastPosition;
  /** Default auto-dismiss time. Default `4000`. */
  defaultDuration?: number | null;
  /** Inset from the top edge (e.g. status bar / safe area). Default `16`. */
  topOffset?: number;
  /** Inset from the bottom edge. Default `16`. */
  bottomOffset?: number;
  /** Max toasts visible per position; oldest are dropped. Default `5`. */
  maxVisible?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

let counter = 0;

/**
 * Mount once near the app root (inside `ThemeProvider`). Provides `useToast()`
 * and renders toasts in an absolutely positioned layer over the app.
 */
export function ToastProvider({ children, defaultPosition = 'top', defaultDuration = 4000, topOffset = 16, bottomOffset = 16, maxVisible = 5, containerStyle }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  const close = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const api = useMemo<ToastApi>(() => {
    const fn = ((options: ToastOptions) => {
      const id = options.id ?? `toast-${++counter}`;
      const instance: ToastInstance = {
        status: 'info',
        isClosable: true,
        ...options,
        id,
        duration: options.duration === undefined ? defaultDuration : options.duration,
        position: options.position ?? defaultPosition,
      };
      setToasts((prev) => {
        const without = prev.filter((t) => t.id !== id);
        const same = without.filter((t) => t.position === instance.position);
        const overflow = Math.max(0, same.length + 1 - maxVisible);
        const dropIds = new Set(same.slice(0, overflow).map((t) => t.id));
        return [...without.filter((t) => !dropIds.has(t.id)), instance];
      });
      return id;
    }) as ToastApi;
    fn.close = close;
    fn.closeAll = () => setToasts([]);
    fn.update = (id, options) => setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...options, id } : t)));
    fn.isActive = (id) => toasts.some((t) => t.id === id);
    return fn;
  }, [close, defaultDuration, defaultPosition, maxVisible, toasts]);

  const positions: ToastPosition[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right'];

  return (
    <ToastContext.Provider value={api}>
      {children}
      {positions.map((pos) => {
        const list = toasts.filter((t) => t.position === pos);
        if (!list.length) return null;
        const top = pos.startsWith('top');
        const align = pos.endsWith('left') ? 'flex-start' : pos.endsWith('right') ? 'flex-end' : 'center';
        return (
          <View
            key={pos}
            pointerEvents="box-none"
            accessibilityLiveRegion="polite"
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                top: top ? topOffset : undefined,
                bottom: top ? undefined : bottomOffset,
                alignItems: align,
                paddingHorizontal: 16,
                gap: 8,
                zIndex: 1700,
                ...(Platform.OS === 'web' ? ({ position: 'fixed' } as unknown as ViewStyle) : null),
              },
              containerStyle,
            ]}
          >
            {list.map((t) => (
              <ToastView key={t.id} toast={t} onClose={() => close(t.id)} />
            ))}
          </View>
        );
      })}
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = 'ToastProvider';

/** Show notifications from anywhere below a `ToastProvider`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a <ToastProvider>.');
  return ctx;
}

function ToastView({ toast, onClose }: { toast: ToastInstance; onClose: () => void }) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const [closing, setClosing] = useState(false);
  const top = toast.position.startsWith('top');

  const dismiss = useCallback(() => {
    if (closing) return;
    setClosing(true);
    Animated.timing(anim, { toValue: 0, duration: theme.durations.normal, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      onClose();
      toast.onCloseComplete?.();
    });
  }, [anim, closing, onClose, theme.durations.normal, toast]);

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: theme.durations.normal, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [anim, theme.durations.normal]);

  useEffect(() => {
    if (toast.duration === null) return;
    const t = setTimeout(dismiss, toast.duration);
    return () => clearTimeout(t);
  }, [toast.duration, dismiss]);

  const scaleByStatus: Record<ToastStatus, string> = { info: 'primary', success: 'success', warning: 'warning', error: 'danger', neutral: 'neutral' };
  const scale = theme.colors.palette[scaleByStatus[toast.status]];
  const dark = theme.mode === 'dark';

  const content = toast.render ? (
    toast.render({ onClose: dismiss, id: toast.id })
  ) : (
    <Surface
      accessibilityRole="alert"
      shadow="lg"
      rounded="lg"
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing[3],
        borderLeftWidth: 4,
        borderLeftColor: scale[dark ? 400 : 500],
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        minWidth: 280,
        maxWidth: 420,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        {toast.title ? (
          typeof toast.title === 'string' ? (
            <Text weight="semibold">{toast.title}</Text>
          ) : (
            toast.title
          )
        ) : null}
        {toast.description ? (
          typeof toast.description === 'string' ? (
            <Text size="sm" color="textMuted">
              {toast.description}
            </Text>
          ) : (
            toast.description
          )
        ) : null}
      </View>
      {toast.action ? (
        <Pressable onPress={toast.action.onPress} accessibilityRole="button" style={{ paddingVertical: 2 }}>
          <Text size="sm" weight="semibold" color={`${scaleByStatus[toast.status]}.${dark ? 300 : 600}`}>
            {toast.action.label}
          </Text>
        </Pressable>
      ) : null}
      {toast.isClosable ? (
        <Pressable onPress={dismiss} accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={8} style={{ paddingHorizontal: 2 }}>
          <Text color="textMuted" size="lg" style={{ lineHeight: theme.fontSizes.lg + 2 }}>
            ×
          </Text>
        </Pressable>
      ) : null}
    </Surface>
  );

  return (
    <Animated.View
      testID={`toast-${toast.id}`}
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [top ? -16 : 16, 0] }) }],
      }}
    >
      {content}
    </Animated.View>
  );
}
