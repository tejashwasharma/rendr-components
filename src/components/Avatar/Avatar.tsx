import type React from 'react';
import { Children, cloneElement, forwardRef, isValidElement, useState } from 'react';
import { Image, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import type { ColorScheme } from '../../theme/types';
import { useComponentDefaults, type Size } from '../../utils/variants';
import { useStyleProps, type StyleProps } from '../../utils/styleProps';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { resolveColor } from '../../utils/getToken';
import { Text } from '../Text/Text';

export type AvatarSize = Size | '2xl' | number;

export interface AvatarProps extends StyleProps {
  style?: StyleProp<ViewStyle>;
  /** Image URL or RN image source. */
  src?: string | ImageSourcePropType;
  /** Person's name; used for initials and the accessibility label. */
  name?: string;
  size?: AvatarSize;
  /** Default `'circle'`. */
  shape?: 'circle' | 'rounded' | 'square';
  /** Custom fallback when there's no image (defaults to initials). */
  fallback?: React.ReactNode;
  /** Background scheme for the initials fallback. Defaults to a scheme derived from `name`. */
  colorScheme?: ColorScheme;
  /** Presence indicator drawn at the bottom-right. */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Show a border (useful in `AvatarGroup`). */
  showBorder?: boolean;
  borderColor?: string;
  accessibilityLabel?: string;
  testID?: string;
}

export const AVATAR_SIZES: Record<Exclude<AvatarSize, number>, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 96 };

function initialsOf(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

const AUTO_SCHEMES: ColorScheme[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];
function schemeFor(name?: string): ColorScheme {
  if (!name) return 'neutral';
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AUTO_SCHEMES[Math.abs(hash) % AUTO_SCHEMES.length];
}

/** Displays a user's photo, or their initials when no image is available. */
export const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, AvatarProps>((rawProps, ref) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const props = useComponentDefaults(theme, 'Avatar', rawProps);
  const { style, src, name, size = 'md', shape = 'circle', fallback, colorScheme, status, showBorder, borderColor, accessibilityLabel, testID, ...rest } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [failed, setFailed] = useState(false);

  const px = typeof size === 'number' ? size : AVATAR_SIZES[size];
  const radius = shape === 'circle' ? px / 2 : shape === 'rounded' ? theme.radii.md : 0;
  const scheme = colorScheme ?? schemeFor(name);
  const scale = theme.colors.palette[scheme] ?? theme.colors.palette.neutral;
  const dark = theme.mode === 'dark';
  const source = typeof src === 'string' ? { uri: src } : src;
  const showImage = !!source && !failed;

  const statusColor: Record<NonNullable<AvatarProps['status']>, string> = {
    online: theme.colors.palette.success[500],
    offline: theme.colors.palette.neutral[400],
    busy: theme.colors.palette.danger[500],
    away: theme.colors.palette.warning[500],
  };

  return (
    <View
      ref={ref}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name}
      testID={testID}
      style={[
        {
          width: px,
          height: px,
          borderRadius: radius,
          backgroundColor: dark ? scale[800] : scale[100],
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: showBorder ? theme.borderWidths.medium : 0,
          borderColor: resolveColor(theme, borderColor ?? 'bg'),
        },
        sx,
        style,
      ]}
      {...(others as object)}
    >
      {showImage ? (
        <Image
          source={source}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
          style={{ width: '100%', height: '100%', borderRadius: radius }}
        />
      ) : fallback !== undefined ? (
        fallback
      ) : (
        <Text weight="semibold" color={dark ? scale[200] : scale[700]} style={{ fontSize: px * 0.4, lineHeight: px * 0.5 }}>
          {initialsOf(name)}
        </Text>
      )}
      {status ? (
        <View
          testID={testID ? `${testID}-status` : undefined}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: px * 0.28,
            height: px * 0.28,
            borderRadius: px,
            backgroundColor: statusColor[status],
            borderWidth: theme.borderWidths.medium,
            borderColor: theme.colors.semantic.bg,
          }}
        />
      ) : null}
    </View>
  );
});
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  children?: React.ReactNode;
  /** Maximum avatars shown before a "+N" overflow. */
  max?: number;
  size?: AvatarSize;
  /** Overlap between avatars in px. Default `-8`. */
  spacing?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Stacks avatars with overlap and a "+N" overflow indicator. */
export function AvatarGroup({ children, max, size = 'md', spacing = -8, style, testID }: AvatarGroupProps) {
  const theme = useTheme();
  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<AvatarProps>[];
  const visible = max ? items.slice(0, max) : items;
  const extra = items.length - visible.length;
  const px = typeof size === 'number' ? size : AVATAR_SIZES[size];
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]} testID={testID}>
      {visible.map((child, i) => (
        <View key={child.key ?? i} style={{ marginLeft: i === 0 ? 0 : spacing, zIndex: visible.length - i }}>
          {cloneElement(child, { size, showBorder: true, ...child.props })}
        </View>
      ))}
      {extra > 0 ? (
        <View
          style={{
            marginLeft: spacing,
            width: px,
            height: px,
            borderRadius: px / 2,
            backgroundColor: theme.colors.semantic.surfaceHover,
            borderWidth: theme.borderWidths.medium,
            borderColor: theme.colors.semantic.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text weight="semibold" color="textMuted" style={{ fontSize: px * 0.35 }}>
            +{extra}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
AvatarGroup.displayName = 'AvatarGroup';
