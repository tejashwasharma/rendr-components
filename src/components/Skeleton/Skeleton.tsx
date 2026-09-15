import type React from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import type { RadiiToken } from '../../theme/types';
import { useStyleProps, type StyleProps } from '../../utils/styleProps';
import { useComponentDefaults } from '../../utils/variants';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { resolveDimension, resolveRadius, resolveSpace } from '../../utils/getToken';

export interface SkeletonProps extends StyleProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** When true, renders `children` instead of the placeholder. */
  isLoaded?: boolean;
  /** Width (theme spacing key, number, or percentage). Default `'100%'`. */
  width?: number | string;
  /** Height. Default `16`. */
  height?: number | string;
  rounded?: RadiiToken | number;
  /** Pulse animation. Default `true`. */
  animate?: boolean;
  /** Placeholder color token/raw color. */
  startColor?: string;
  endColor?: string;
  testID?: string;
}

/** A pulsing placeholder shown while content loads. */
export const Skeleton: React.ForwardRefExoticComponent<SkeletonProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, SkeletonProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const props = useComponentDefaults(theme, 'Skeleton', rawProps);
  const { style, children, isLoaded, width = '100%', height = 16, rounded = 'md', animate = true, startColor, endColor, testID, ...rest } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate || isLoaded) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, isLoaded, pulse]);

  if (isLoaded) return <>{children}</>;

  const dark = theme.mode === 'dark';
  const glassOn = theme.glass.enabled;
  const from = startColor ?? (glassOn ? theme.colors.semantic.surfaceSubtle : dark ? theme.colors.palette.neutral[800] : theme.colors.palette.neutral[200]);
  const to = endColor ?? (glassOn ? theme.colors.semantic.surfaceHover : dark ? theme.colors.palette.neutral[700] : theme.colors.palette.neutral[100]);

  return (
    <View ref={ref} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" testID={testID} style={[sx, style]} {...(others as object)}>
      <Animated.View
        style={{
          width: resolveDimension(theme, width) as number | string,
          height: resolveDimension(theme, height) as number | string,
          borderRadius: resolveRadius(theme, rounded),
          backgroundColor: animate ? pulse.interpolate({ inputRange: [0, 1], outputRange: [from, to] }) : from,
        }}
      />
      {/* Hidden children preserve layout size when provided. */}
      {children ? <View style={{ opacity: 0, position: 'absolute' }}>{children}</View> : null}
    </View>
  );
});
Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps extends Omit<SkeletonProps, 'width' | 'height'> {
  /** Number of lines. Default `3`. */
  noOfLines?: number;
  /** Line height. Default `12`. */
  lineHeight?: number;
  /** Gap between lines (theme spacing key). Default `2`. */
  spacing?: number | string;
  /** Width of the last line, to look like a paragraph. Default `'60%'`. */
  lastLineWidth?: number | string;
}

/** Several skeleton lines that mimic a paragraph of text. */
export function SkeletonText({ noOfLines = 3, lineHeight = 12, spacing = 2, lastLineWidth = '60%', isLoaded, children, style, ...rest }: SkeletonTextProps) {
  const theme = useTheme();
  if (isLoaded) return <>{children}</>;
  return (
    <View style={[{ gap: resolveSpace(theme, spacing) as number }, style]}>
      {Array.from({ length: noOfLines }).map((_, i) => (
        <Skeleton key={i} height={lineHeight} width={i === noOfLines - 1 && noOfLines > 1 ? lastLineWidth : '100%'} {...rest} />
      ))}
    </View>
  );
}
SkeletonText.displayName = 'SkeletonText';

export interface SkeletonCircleProps extends Omit<SkeletonProps, 'width' | 'height' | 'rounded'> {
  /** Diameter in px. Default `40`. */
  size?: number;
}

/** A round skeleton, e.g. for avatars. */
export function SkeletonCircle({ size = 40, ...rest }: SkeletonCircleProps) {
  return <Skeleton width={size} height={size} rounded="full" {...rest} />;
}
SkeletonCircle.displayName = 'SkeletonCircle';
