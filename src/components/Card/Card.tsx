import React, { useState } from 'react';
import { Platform, Pressable, View, type PressableProps, type ViewStyle } from 'react-native';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { useComponentDefaults } from '../../utils/variants';
import { webTransition } from '../../utils/motion';
import type { RadiiToken, ShadowTokenName } from '../../theme/types';
import { useTheme } from '../../hooks/useTheme';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { Surface } from '../Surface/Surface';

export type CardVariant = 'elevated' | 'outline' | 'filled' | 'unstyled';

export interface CardOwnProps extends BoxOwnProps {
  /** Default `'elevated'`. */
  variant?: CardVariant;
  /** Inner padding (theme spacing key). Default `4`. Set `0` and use `Card.Body` for full-bleed headers. */
  padding?: number | string;
  rounded?: RadiiToken | number;
  /** Shadow token for `elevated`. Default `'md'`. */
  shadow?: ShadowTokenName;
  /** Turns the card into a `Pressable` with hover/press feedback. */
  isPressable?: boolean;
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  isDisabled?: boolean;
  /** Override the provider's glass switch for this card. */
  glass?: boolean;
  accessibilityLabel?: string;
}

export type CardProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, CardOwnProps>;

const CardRoot = forwardRefPolymorphic<typeof View, CardOwnProps>((rawProps, ref) => {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Card', rawProps);
  const { as, variant = 'elevated', padding = 4, rounded = 'lg', shadow = 'md', isPressable, onPress, onLongPress, isDisabled, glass, style, accessibilityLabel, ...rest } = props;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const interactive = isPressable || !!onPress;
  const pressProps = interactive
    ? {
        onPress,
        onLongPress,
        disabled: isDisabled,
        accessibilityRole: 'button' as const,
        accessibilityState: { disabled: !!isDisabled },
        accessibilityLabel,
        onHoverIn: () => setHovered(true),
        onHoverOut: () => setHovered(false),
        onPressIn: () => setPressed(true),
        onPressOut: () => setPressed(false),
      }
    : {};

  const feedback: ViewStyle | undefined = interactive
    ? {
        opacity: isDisabled ? theme.opacity.disabled : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        ...(Platform.OS === 'web' ? ({ cursor: isDisabled ? 'not-allowed' : 'pointer' } as ViewStyle) : null),
        ...webTransition(theme, ['transform', 'background-color', 'border-color', 'box-shadow'], 'fast'),
      }
    : undefined;

  if (variant === 'unstyled') {
    return <Box ref={ref} as={as ?? (interactive ? Pressable : View)} p={padding} style={[feedback, style]} {...pressProps} {...(rest as object)} />;
  }

  return (
    <Surface
      ref={ref}
      as={as ?? (interactive ? Pressable : View)}
      variant={variant === 'filled' ? 'subtle' : 'sheet'}
      shadow={variant === 'elevated' ? (shadow as 'sm' | 'md' | 'lg' | 'xl') : 'none'}
      rounded={rounded}
      glass={glass}
      hovered={interactive && hovered}
      pressed={interactive && pressed}
      p={padding}
      style={[feedback, style]}
      {...pressProps}
      {...(rest as object)}
    />
  );
}, 'Card');

export type CardSectionProps = BoxOwnProps;

/** Top section: usually a title row. Adds a bottom border. */
const CardHeader = forwardRefPolymorphic<typeof View, CardSectionProps>(({ style, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Box
      ref={ref}
      pb={3}
      mb={3}
      borderColor={theme.colors.semantic.border}
      style={[{ borderBottomWidth: theme.borderWidths.thin }, style]}
      {...(props as object)}
    />
  );
}, 'Card.Header');

const CardBody = forwardRefPolymorphic<typeof View, CardSectionProps>((props, ref) => <Box ref={ref} {...(props as object)} />, 'Card.Body');

/** Bottom section: actions. Adds a top border. */
const CardFooter = forwardRefPolymorphic<typeof View, CardSectionProps>(({ style, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Box
      ref={ref}
      pt={3}
      mt={3}
      direction="row"
      align="center"
      justify="flex-end"
      gap={2}
      borderColor={theme.colors.semantic.border}
      style={[{ borderTopWidth: theme.borderWidths.thin }, style]}
      {...(props as object)}
    />
  );
}, 'Card.Footer');

/** A surface that groups related content. Compose with `Card.Header`, `Card.Body`, `Card.Footer`. */
export const Card = Object.assign(CardRoot, { Header: CardHeader, Body: CardBody, Footer: CardFooter });
