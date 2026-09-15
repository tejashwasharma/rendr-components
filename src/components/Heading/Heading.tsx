import React from 'react';
import { Platform, type Text as RNText } from 'react-native';
import { Text } from '../Text/Text';
import type { TextOwnProps } from '../Text/Text.types';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import type { FontSizeToken } from '../../theme/types';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOwnProps extends TextOwnProps {
  /** Semantic heading level. Drives default size and accessibility role. Default `2`. */
  level?: HeadingLevel;
}

export type HeadingProps<C extends React.ElementType = typeof RNText> = PolymorphicComponentProps<C, HeadingOwnProps>;

const LEVEL_SIZE: Record<HeadingLevel, FontSizeToken> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
};

/** A `Text` preset for headings with semantic level and heading font. */
export const Heading = forwardRefPolymorphic<typeof RNText, HeadingOwnProps>((props, ref) => {
  const { level = 2, size, weight = 'bold', font = 'heading', lineHeight = 'tight', ...rest } = props;
  const webProps = Platform.OS === 'web' ? { 'aria-level': level } : {};
  return (
    <Text
      ref={ref}
      accessibilityRole="header"
      size={size ?? LEVEL_SIZE[level]}
      weight={weight}
      font={font}
      lineHeight={lineHeight}
      {...webProps}
      {...(rest as object)}
    />
  );
}, 'Heading');
