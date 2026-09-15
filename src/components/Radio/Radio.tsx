import type React from 'react';
import { forwardRef, useState } from 'react';
import { Platform, Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import type { PressableRef } from '../../utils/refs';
import type { ColorScheme } from '../../theme/types';
import { useStyleProps, type StyleProps } from '../../utils/styleProps';
import { useComponentDefaults, type Size } from '../../utils/variants';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFormField } from '../FormField/FormFieldContext';
import { Text } from '../Text/Text';
import { getControlSizes } from '../Checkbox/controlSizes';
import { useRadioGroup } from './RadioGroup';

const StyledPressable = styled(Pressable)``;

export interface RadioProps extends StyleProps, Omit<PressableProps, 'style' | 'onPress' | 'children' | 'disabled'> {
  style?: StyleProp<ViewStyle>;
  /** The value this radio represents inside a `RadioGroup`. */
  value: string;
  /** Controlled checked state when used outside a group. */
  checked?: boolean;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  isInvalid?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;
  size?: Size;
  colorScheme?: ColorScheme;
}

/** A single radio button. Usually placed inside a `RadioGroup`. */
export const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<PressableRef>> = forwardRef<PressableRef, RadioProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const field = useFormField();
  const group = useRadioGroup();
  const props = useComponentDefaults(theme, 'Radio', rawProps);
  const {
    style,
    value,
    checked,
    onChange,
    isDisabled,
    isInvalid,
    label,
    children,
    size: sizeProp,
    colorScheme: schemeProp,
    accessibilityLabel,
    ...rest
  } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [hovered, setHovered] = useState(false);

  const size = sizeProp ?? group?.size ?? 'md';
  const colorScheme = schemeProp ?? group?.colorScheme ?? 'primary';
  const isChecked = group ? group.value === value : !!checked;
  const disabled = !!(isDisabled ?? group?.isDisabled ?? field?.isDisabled);
  const invalid = !!(isInvalid ?? group?.isInvalid ?? field?.isInvalid);

  const sizes = getControlSizes(theme)[size];
  const scale = theme.colors.palette[colorScheme] ?? theme.colors.palette.primary;
  const { semantic } = theme.colors;
  const accent = scale[theme.mode === 'dark' ? 400 : 600];

  const select = () => {
    group?.setValue(value);
    onChange?.(value);
  };

  const content = label ?? children;

  return (
    <StyledPressable
      ref={ref}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : undefined)}
      disabled={disabled}
      onPress={select}
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
      <View
        style={{
          width: sizes.box,
          height: sizes.box,
          borderRadius: sizes.box / 2,
          borderWidth: theme.borderWidths.medium,
          borderColor: invalid ? theme.colors.palette.danger[500] : isChecked ? accent : hovered ? semantic.borderStrong : semantic.border,
          backgroundColor: semantic.field,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked ? <View style={{ width: sizes.box * 0.45, height: sizes.box * 0.45, borderRadius: sizes.box, backgroundColor: accent }} /> : null}
      </View>
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
Radio.displayName = 'Radio';
