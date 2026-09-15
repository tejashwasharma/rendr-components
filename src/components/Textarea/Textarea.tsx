import type React from 'react';
import { forwardRef, useState } from 'react';
import { Platform, type TextInputContentSizeChangeEvent } from 'react-native';
import type { TextInputRef } from '../../utils/refs';
import { useStyleProps } from '../../utils/styleProps';
import { useComponentDefaults } from '../../utils/variants';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFormField } from '../FormField/FormFieldContext';
import { StyledInputContainer, StyledTextInput, getInputSizes } from '../Input/Input.styles';
import { getInputStyles } from '../Input/useInputStyles';
import type { InputOwnProps } from '../Input/Input.types';

export interface TextareaProps extends Omit<InputOwnProps, 'leftElement' | 'rightElement' | 'multiline'> {
  /** Minimum visible rows. Default `3`. */
  minRows?: number;
  /** Maximum rows before scrolling. Unlimited by default. */
  maxRows?: number;
  /** Grow with content between `minRows` and `maxRows`. Default `true`. */
  autoGrow?: boolean;
}

/** A multi-line text field that grows with its content. */
export const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<TextInputRef>> = forwardRef<TextInputRef, TextareaProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const field = useFormField();
  const props = useComponentDefaults(theme, 'Textarea', rawProps);
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
    isFullWidth = true,
    minRows = 3,
    maxRows,
    autoGrow = true,
    onFocus,
    onBlur,
    onContentSizeChange,
    placeholderTextColor,
    testID,
    ...rest
  } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | undefined>();

  const invalid = !!(isInvalid ?? field?.isInvalid);
  const disabled = !!(isDisabled ?? field?.isDisabled);
  const readOnly = !!(isReadOnly ?? field?.isReadOnly);
  const required = !!(isRequired ?? field?.isRequired);

  const { container, text, placeholder } = getInputStyles(theme, { variant, size, colorScheme, rounded, focused, invalid, disabled, readOnly, hovered });
  const sizes = getInputSizes(theme)[size];
  const lineHeight = Math.round(sizes.fontSize * theme.lineHeights.normal);
  const padY = theme.spacing[2];
  const minHeight = lineHeight * minRows + padY * 2;
  const maxHeight = maxRows ? lineHeight * maxRows + padY * 2 : undefined;
  const grown = autoGrow && contentHeight ? Math.max(minHeight, Math.min(contentHeight + padY * 2, maxHeight ?? Infinity)) : minHeight;

  return (
    <StyledInputContainer
      {...(Platform.OS === 'web' ? ({ onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) } as object) : {})}
      style={[container, { alignItems: 'stretch', minHeight: undefined, alignSelf: isFullWidth ? 'stretch' : 'flex-start' }, sx, style]}>
      <StyledTextInput
        ref={ref}
        multiline
        textAlignVertical="top"
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
        onContentSizeChange={(e: TextInputContentSizeChangeEvent) => {
          setContentHeight(e.nativeEvent.contentSize.height);
          onContentSizeChange?.(e);
        }}
        style={[text, { height: grown, minHeight, maxHeight, lineHeight, paddingVertical: padY }, inputStyle]}
        {...(others as object)}
      />
    </StyledInputContainer>
  );
});
Textarea.displayName = 'Textarea';
