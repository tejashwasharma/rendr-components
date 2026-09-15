import React, { useState } from 'react';
import type { Pressable} from 'react-native';
import { Platform, View, type PressableStateCallbackType, type TextStyle, type ViewStyle } from 'react-native';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { useStyleProps } from '../../utils/styleProps';
import { resolveRadius } from '../../utils/getToken';
import { getThemeVariant, getVariantColors, stateBg, useComponentDefaults, type Variant } from '../../utils/variants';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { webTransition } from '../../utils/motion';
import { Text } from '../Text/Text';
import { Spinner } from '../Spinner/Spinner';
import { StyledPressable, getButtonSizes } from './Button.styles';
import type { ButtonOwnProps } from './Button.types';

export type ButtonProps<C extends React.ElementType = typeof Pressable> = PolymorphicComponentProps<C, ButtonOwnProps>;

/** Custom variant shape an app can register under `theme.components.Button.variants`. */
export interface ButtonThemeVariant {
  container?: ViewStyle;
  containerHovered?: ViewStyle;
  containerPressed?: ViewStyle;
  text?: TextStyle;
}

/**
 * Pressable button with variants, sizes, color schemes, icons and a loading
 * state. Renders a `Pressable` by default; use `as` to render a router link
 * or any other pressable component.
 */
export const Button = forwardRefPolymorphic<typeof Pressable, ButtonOwnProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const props = useComponentDefaults(theme, 'Button', rawProps);
  const {
    as,
    children,
    style,
    variant = 'solid',
    size = 'md',
    colorScheme = 'primary',
    rounded = 'md',
    isLoading = false,
    loadingText,
    spinnerPlacement = 'start',
    leftIcon,
    rightIcon,
    isFullWidth,
    isDisabled,
    disabled,
    textStyle,
    onPress,
    accessibilityLabel,
    ...rest
  } = props;

  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [hovered, setHovered] = useState(false);

  const isOff = !!(isDisabled || disabled || isLoading);
  const sizes = getButtonSizes(theme)[size];
  const themeVariant = getThemeVariant<ButtonThemeVariant>(theme, 'Button', variant);
  const builtIn = (['solid', 'outline', 'ghost', 'link', 'subtle'] as Variant[]).includes(variant as Variant)
    ? (variant as Variant)
    : 'solid';
  const colors = getVariantColors(theme, colorScheme, builtIn);
  const isLink = builtIn === 'link' && !themeVariant;

  const containerStyle = (state: PressableStateCallbackType): ViewStyle[] => {
    const pressed = state.pressed;
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: isFullWidth ? 'stretch' : 'flex-start',
      height: isLink ? undefined : sizes.height,
      paddingHorizontal: isLink ? 0 : sizes.paddingX,
      borderRadius: resolveRadius(theme, rounded),
      borderWidth: theme.borderWidths.thin,
      backgroundColor: builtIn === 'outline' && !hovered && !pressed ? theme.colors.semantic.field : stateBg(colors, { hovered, pressed }),
      borderColor: builtIn === 'outline' ? (hovered ? theme.colors.semantic.borderStrong : colors.border) : colors.border,
      opacity: isOff ? theme.opacity.disabled : 1,
      gap: sizes.iconGap,
      transform: [{ scale: pressed && !isOff ? 0.97 : 1 }],
      ...(Platform.OS === 'web' && builtIn === 'outline' && theme.glass.enabled
        ? ({ backdropFilter: `blur(${theme.glass.blur}px)`, WebkitBackdropFilter: `blur(${theme.glass.blur}px)` } as unknown as ViewStyle)
        : null),
      ...(Platform.OS === 'web' ? ({ cursor: isOff ? 'not-allowed' : 'pointer', userSelect: 'none' } as ViewStyle) : null),
      ...webTransition(theme, ['background-color', 'border-color', 'color', 'box-shadow', 'transform', 'opacity'], 'fast'),
    };
    const custom: ViewStyle[] = themeVariant
      ? [themeVariant.container ?? {}, hovered ? themeVariant.containerHovered ?? {} : {}, pressed ? themeVariant.containerPressed ?? {} : {}]
      : [];
    return [base, ...custom, sx, style as ViewStyle];
  };

  const labelStyle: TextStyle = {
    color: colors.text,
    fontSize: sizes.fontSize,
    fontWeight: theme.fontWeights.semibold,
    textDecorationLine: isLink && hovered ? 'underline' : undefined,
    ...(themeVariant?.text ?? {}),
  };

  const label = isLoading && loadingText ? loadingText : children;
  const spinner = isLoading ? <Spinner size={sizes.spinner} color={labelStyle.color as string} /> : null;

  return (
    <StyledPressable
      ref={ref}
      as={as}
      accessibilityRole="button"
      accessibilityState={{ disabled: isOff, busy: isLoading }}
      accessibilityLabel={accessibilityLabel}
      disabled={isOff}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={containerStyle}
      {...(others as object)}
    >
      {isLoading && !loadingText ? (
        // Keep the button size stable: render content invisibly beneath a centered spinner.
        <>
          <View style={{ position: 'absolute', alignSelf: 'center' }}>{spinner}</View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: sizes.iconGap, opacity: 0 }}>
            {leftIcon}
            {typeof label === 'string' || typeof label === 'number' ? <Text style={[labelStyle, textStyle]}>{label}</Text> : label}
            {rightIcon}
          </View>
        </>
      ) : (
        <>
          {isLoading && spinnerPlacement === 'start' ? spinner : leftIcon}
          {typeof label === 'string' || typeof label === 'number' ? <Text style={[labelStyle, textStyle]}>{label}</Text> : label}
          {isLoading && spinnerPlacement === 'end' ? spinner : rightIcon}
        </>
      )}
    </StyledPressable>
  );
}, 'Button');
