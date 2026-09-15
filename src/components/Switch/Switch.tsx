import type React from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import type { PressableRef } from '../../utils/refs';
import type { ColorScheme } from '../../theme/types';
import { useStyleProps, type StyleProps } from '../../utils/styleProps';
import { useComponentDefaults, type Size } from '../../utils/variants';
import { useControllableState } from '../../hooks/useControllableState';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFormField } from '../FormField/FormFieldContext';
import { Text } from '../Text/Text';

const StyledPressable = styled(Pressable)``;

export interface SwitchProps extends StyleProps, Omit<PressableProps, 'style' | 'onPress' | 'children' | 'disabled'> {
  style?: StyleProp<ViewStyle>;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** Label position relative to the track. Default `'end'`. */
  labelPlacement?: 'start' | 'end';
  size?: Size;
  colorScheme?: ColorScheme;
}

const TRACK: Record<Size, { w: number; h: number; pad: number }> = {
  xs: { w: 28, h: 16, pad: 2 },
  sm: { w: 34, h: 20, pad: 2 },
  md: { w: 44, h: 24, pad: 2 },
  lg: { w: 54, h: 30, pad: 3 },
  xl: { w: 64, h: 36, pad: 3 },
};

/**
 * A toggle switch drawn with theme colors on every platform (rather than the
 * OS-native switch) so it always matches the app's theme.
 */
export const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<PressableRef>> = forwardRef<PressableRef, SwitchProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const field = useFormField();
  const props = useComponentDefaults(theme, 'Switch', rawProps);
  const {
    style,
    checked,
    defaultChecked = false,
    onChange,
    isDisabled,
    label,
    children,
    labelPlacement = 'end',
    size = 'md',
    colorScheme = 'primary',
    accessibilityLabel,
    ...rest
  } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [isChecked, setChecked] = useControllableState<boolean>({ value: checked, defaultValue: defaultChecked, onChange });
  const disabled = !!(isDisabled ?? field?.isDisabled);

  const t = TRACK[size];
  const knob = t.h - t.pad * 2;
  const travel = t.w - knob - t.pad * 2;
  const anim = useRef(new Animated.Value(isChecked ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: isChecked ? 1 : 0, duration: theme.durations.fast, useNativeDriver: false }).start();
  }, [isChecked, anim, theme.durations.fast]);

  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.primary;
  const { semantic } = theme.colors;
  const onColor = scale[theme.mode === 'dark' ? 500 : 600];
  const offColor = theme.mode === 'dark' ? theme.colors.palette.neutral[600] : theme.colors.palette.neutral[300];

  const content = label ?? children;
  const labelNode =
    content != null ? (
      typeof content === 'string' || typeof content === 'number' ? (
        <Text size={size} color="text">
          {content}
        </Text>
      ) : (
        content
      )
    ) : null;

  return (
    <StyledPressable
      ref={ref}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : undefined)}
      disabled={disabled}
      onPress={() => setChecked((v) => !v)}
      style={[
        {
          flexDirection: labelPlacement === 'start' ? 'row-reverse' : 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: theme.spacing[2],
          opacity: disabled ? theme.opacity.disabled : 1,
          ...(Platform.OS === 'web' ? ({ cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' } as ViewStyle) : null),
        },
        sx,
        style,
      ]}
      {...(others as object)}
    >
      <Animated.View
        testID="switch-track"
        style={{
          width: t.w,
          height: t.h,
          borderRadius: t.h / 2,
          padding: t.pad,
          justifyContent: 'center',
          backgroundColor: anim.interpolate({ inputRange: [0, 1], outputRange: [offColor, onColor] }),
        }}
      >
        <Animated.View
          style={{
            width: knob,
            height: knob,
            borderRadius: knob / 2,
            backgroundColor: semantic.white,
            transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
            ...(Platform.OS === 'web' ? ({ boxShadow: '0 1px 2px rgba(0,0,0,0.25)' } as ViewStyle) : { elevation: 2 }),
          }}
        />
      </Animated.View>
      {labelNode}
    </StyledPressable>
  );
});
Switch.displayName = 'Switch';
