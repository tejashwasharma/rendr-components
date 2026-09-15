import React from 'react';
import type { Text as RNText} from 'react-native';
import { type TextStyle } from 'react-native';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { useStyleProps } from '../../utils/styleProps';
import { resolveColor, resolveFontSize, resolveFontWeight, resolveScale } from '../../utils/getToken';
import { useComponentDefaults } from '../../utils/variants';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { StyledText } from './Text.styles';
import type { TextOwnProps } from './Text.types';

export type TextProps<C extends React.ElementType = typeof RNText> = PolymorphicComponentProps<C, TextOwnProps>;

/** Themed text. Reads size, weight, colour and font family from the theme. */
export const Text = forwardRefPolymorphic<typeof RNText, TextOwnProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const props = useComponentDefaults(theme, 'Text', rawProps);
  const {
    as,
    style,
    size = 'md',
    weight,
    color = 'text',
    align,
    lineHeight = 'normal',
    font = 'body',
    italic,
    underline,
    strikethrough,
    uppercase,
    truncate,
    numberOfLines,
    letterSpacing,
    ...rest
  } = props;

  const [sx, others] = useStyleProps(theme, breakpoint, rest);

  const fontSize = resolveFontSize(theme, size) ?? theme.fontSizes.md;
  const lh = resolveScale(theme.lineHeights as Record<string, unknown>, lineHeight) as number | undefined;
  const family = (theme.fonts as Record<string, string | undefined>)[font] ?? (font in theme.fonts ? undefined : font);

  const textStyle: TextStyle = {
    fontSize,
    lineHeight: lh !== undefined ? Math.round(fontSize * lh) : undefined,
    fontWeight: resolveFontWeight(theme, weight) as TextStyle['fontWeight'],
    color: resolveColor(theme, color),
    textAlign: align,
    fontFamily: family,
    fontStyle: italic ? 'italic' : undefined,
    textDecorationLine: underline && strikethrough ? 'underline line-through' : underline ? 'underline' : strikethrough ? 'line-through' : undefined,
    textTransform: uppercase ? 'uppercase' : undefined,
    letterSpacing,
  };

  const lines = numberOfLines ?? (truncate === true ? 1 : typeof truncate === 'number' ? truncate : undefined);

  return (
    <StyledText
      ref={ref}
      as={as}
      numberOfLines={lines}
      ellipsizeMode={lines ? 'tail' : undefined}
      style={[textStyle, sx as TextStyle, style]}
      {...(others as object)}
    />
  );
}, 'Text');
