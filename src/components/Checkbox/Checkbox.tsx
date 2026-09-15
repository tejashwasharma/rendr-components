import type React from 'react';
import { forwardRef, useState } from 'react';
import { Platform, Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
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
import { getControlSizes } from './controlSizes';

const StyledPressable = styled(Pressable)``;

export interface CheckboxProps extends StyleProps, Omit<PressableProps, 'style' | 'onPress' | 'children' | 'disabled'> {
  style?: StyleProp<ViewStyle>;
  /** Controlled checked state. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Shows a dash instead of a check (visual only; `checked` still drives value). */
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  /** Label rendered to the right; can be any node. */
  label?: React.ReactNode;
  children?: React.ReactNode;
  size?: Size;
  colorScheme?: ColorScheme;
  /** Form value, forwarded for convenience. */
  value?: string;
}

/** A theme-aware checkbox with an optional label. Works controlled or uncontrolled. */
export const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<PressableRef>> = forwardRef<PressableRef, CheckboxProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const field = useFormField();
  const props = useComponentDefaults(theme, 'Checkbox', rawProps);
  const {
    style,
    checked,
    defaultChecked = false,
    onChange,
    isIndeterminate,
    isDisabled,
    isInvalid,
    label,
    children,
    size = 'md',
    colorScheme = 'primary',
    value: _value,
    accessibilityLabel,
    ...rest
  } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [isChecked, setChecked] = useControllableState<boolean>({ value: checked, defaultValue: defaultChecked, onChange });
  const [hovered, setHovered] = useState(false);

  const disabled = !!(isDisabled ?? field?.isDisabled);
  const invalid = !!(isInvalid ?? field?.isInvalid);
  const sizes = getControlSizes(theme)[size];
  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.primary;
  const { semantic } = theme.colors;
  const dark = theme.mode === 'dark';
  const active = isChecked || isIndeterminate;
  const accent = scale[dark ? 400 : 600];

  const boxStyle: ViewStyle = {
    width: sizes.box,
    height: sizes.box,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.medium,
    borderColor: invalid ? theme.colors.palette.danger[500] : active ? accent : hovered ? semantic.borderStrong : semantic.border,
    backgroundColor: active ? accent : semantic.field,
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Check mark drawn with borders so no icon font is required.
  const check = sizes.box * 0.5;
  const mark = isIndeterminate ? (
    <View style={{ width: check, height: 2, backgroundColor: semantic.white, borderRadius: 1 }} />
  ) : isChecked ? (
    <View
      style={{
        width: check * 0.55,
        height: check,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: semantic.white,
        transform: [{ rotate: '45deg' }, { translateY: -check * 0.12 }],
      }}
    />
  ) : null;

  const content = label ?? children;

  return (
    <StyledPressable
      ref={ref}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isIndeterminate ? 'mixed' : isChecked, disabled }}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : undefined)}
      disabled={disabled}
      onPress={() => setChecked((v) => !v)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: sizes.gap,
          opacity: disabled ? theme.opacity.disabled : 1,
          ...(Platform.OS === 'web' ? ({ cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' } as ViewStyle) : null),
        },
        sx,
        style,
      ]}
      {...(others as object)}
    >
      <View style={boxStyle}>{mark}</View>
      {content != null ? (
        typeof content === 'string' || typeof content === 'number' ? (
          <Text size={size} color="text">
            {content}
          </Text>
        ) : (
          content
        )
      ) : null}
    </StyledPressable>
  );
});
Checkbox.displayName = 'Checkbox';
