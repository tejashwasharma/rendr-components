import type React from 'react';
import { forwardRef, useState } from 'react';
import { Platform, View } from 'react-native';
import type { TextInputRef } from '../../utils/refs';
import { useStyleProps } from '../../utils/styleProps';
import { useComponentDefaults } from '../../utils/variants';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFormField } from '../FormField/FormFieldContext';
import { StyledInputContainer, StyledTextInput } from './Input.styles';
import { getInputStyles } from './useInputStyles';
import type { InputOwnProps } from './Input.types';

export type InputProps = InputOwnProps;

/** A single-line text field. Integrates with `FormField` for label/error state. */
export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<TextInputRef>> = forwardRef<TextInputRef, InputProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const field = useFormField();
  const props = useComponentDefaults(theme, 'Input', rawProps);
  const {
    style,
    inputStyle,
    variant = 'outline',
    size = 'md',
    colorScheme = 'primary',
    rounded = 'md',
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    leftElement,
    rightElement,
    isFullWidth = true,
    onFocus,
    onBlur,
    placeholderTextColor,
    testID,
    ...rest
  } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const invalid = !!(isInvalid ?? field?.isInvalid);
  const disabled = !!(isDisabled ?? field?.isDisabled);
  const readOnly = !!(isReadOnly ?? field?.isReadOnly);
  const required = !!(isRequired ?? field?.isRequired);

  const { container, text, placeholder } = getInputStyles(theme, {
    variant,
    size,
    colorScheme,
    rounded,
    focused,
    invalid,
    disabled,
    readOnly,
    hovered,
  });

  return (
    <StyledInputContainer
      {...(Platform.OS === 'web' ? ({ onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) } as object) : {})}
      style={[container, { alignSelf: isFullWidth ? 'stretch' : 'flex-start' }, sx, style]} testID={testID ? `${testID}-container` : undefined}>
      {leftElement ? <View style={{ marginRight: theme.spacing[2] }}>{leftElement}</View> : null}
      <StyledTextInput
        ref={ref}
        nativeID={field?.id}
        editable={!disabled && !readOnly}
        placeholderTextColor={placeholderTextColor ?? placeholder}
        accessibilityState={{ disabled }}
        accessibilityLabelledBy={field?.id ? `${field.id}-label` : undefined}
        aria-invalid={invalid}
        aria-required={required}
        aria-readonly={readOnly}
        testID={testID}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[text, inputStyle]}
        {...(others as object)}
      />
      {rightElement ? <View style={{ marginLeft: theme.spacing[2] }}>{rightElement}</View> : null}
    </StyledInputContainer>
  );
});
Input.displayName = 'Input';
