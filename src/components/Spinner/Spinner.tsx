import type React from 'react';
import { forwardRef } from 'react';
import { ActivityIndicator, View, type ViewProps } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import { useTheme } from '../../hooks/useTheme';
import { resolveColor } from '../../utils/getToken';
import { useComponentDefaults } from '../../utils/variants';
import type { Size } from '../../utils/variants';
import type { ColorScheme } from '../../theme/types';
import { Text } from '../Text/Text';

export interface SpinnerProps extends ViewProps {
  /** Size token or a raw pixel size. Default `'md'`. */
  size?: Size | number;
  /** Color scheme or any color token/raw color. Default `'primary'`. */
  colorScheme?: ColorScheme;
  /** Explicit color; overrides `colorScheme`. */
  color?: string;
  /** Accessible label announced to screen readers. Default `'Loading'`. */
  label?: string;
  /** Show the label visually beneath the indicator. */
  showLabel?: boolean;
}

const SIZE_PX: Record<Size, number> = { xs: 14, sm: 18, md: 24, lg: 32, xl: 44 };

/** A theme-aware loading indicator. */
export const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, SpinnerProps>((rawProps, ref) => {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Spinner', rawProps);
  const { size = 'md', colorScheme = 'primary', color, label = 'Loading', showLabel, style, ...rest } = props;
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const resolved = color ? resolveColor(theme, color) : resolveColor(theme, `${colorScheme}.${theme.mode === 'dark' ? 400 : 500}`);

  return (
    <View
      ref={ref}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessible
      style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
      {...rest}
    >
      {/* RN's ActivityIndicator only accepts 'small'/'large' or a number; number works on iOS/web, Android scales via transform. */}
      <ActivityIndicator size={px} color={resolved} />
      {showLabel ? (
        <Text size="sm" color="textMuted" mt={2}>
          {label}
        </Text>
      ) : null}
    </View>
  );
});
Spinner.displayName = 'Spinner';
