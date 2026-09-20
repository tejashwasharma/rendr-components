import React from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { forwardRefPolymorphic, type PolymorphicComponentProps } from '../../utils/polymorphic';
import { useStyleProps, type StyleProps } from '../../utils/styleProps';
import { resolveRadius } from '../../utils/getToken';
import { resolveShadow } from '../../utils/shadow';
import { surfaceTransition } from '../../utils/motion';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useGlass } from '../../hooks/useGlass';
import type { RadiiToken } from '../../theme/types';
import { semanticFor } from '../../theme/tokens';

export type SurfaceVariant = 'sheet' | 'subtle' | 'field' | 'plain';

export interface SurfaceOwnProps extends StyleProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * `sheet` — a card-like surface · `subtle` — a quieter inset surface (tab
   * lists, table heads) · `field` — inputs · `plain` — no fill, only the
   * frame. Default `'sheet'`.
   */
  variant?: SurfaceVariant;
  rounded?: RadiiToken | number;
  /** Shadow token. Default `'md'` for sheets, none otherwise. */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Override the provider's glass switch for this surface. */
  glass?: boolean;
  /** Draw the lit-edge rim (glass only). Default from `theme.glass.rim`. */
  rim?: boolean;
  /** Draw the 1px border. Default `true`. */
  bordered?: boolean;
  /** Blur strength override (px). */
  blur?: number;
  /** Interaction state — lightens the fill. */
  hovered?: boolean;
  pressed?: boolean;
}

export type SurfaceProps<C extends React.ElementType = typeof View> = PolymorphicComponentProps<C, SurfaceOwnProps>;

/**
 * The one place the glass recipe lives. Every surface-bearing component
 * (Card, Modal, Menu, Select, Popover, Toast, Tabs, Table, Input…) renders
 * through it, so the glass switch and mode apply everywhere consistently.
 *
 * Glass on  → translucent fill + backdrop blur (CSS on web, `blurComponent`
 *             on native) + lit-edge rim + soft shadow.
 * Glass off → solid fill + 1px border + shadow.
 */
export const Surface = forwardRefPolymorphic<typeof View, SurfaceOwnProps>((props, ref) => {
  const {
    as,
    children,
    style,
    variant = 'sheet',
    rounded = 'lg',
    shadow,
    glass: glassProp,
    rim: rimProp,
    bordered = true,
    blur: blurProp,
    hovered,
    pressed,
    ...rest
  } = props;
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const { enabled, blurComponent: Blur, settings } = useGlass();
  const [sx, others] = useStyleProps(theme, breakpoint, rest);

  const glassOn = glassProp ?? enabled;
  const dark = theme.mode === 'dark';
  // Dark glass drops the border entirely — against a dark ground a 1px rim
  // reads as a hard, slightly-off edge rather than a lit one; the halo
  // shadow alone (see resolveShadow) carries the "floating sheet" cue there.
  const showBorder = bordered && !(glassOn && dark);
  const rim = showBorder && glassOn && (rimProp ?? settings.rim);
  const blur = blurProp ?? settings.blur;
  // A per-surface override needs the matching semantic set, not the provider's.
  const semantic = glassProp === undefined || glassProp === enabled ? theme.colors.semantic : semanticFor(theme.mode, glassOn);
  const radius = resolveRadius(theme, rounded);

  const tintFill =
    variant === 'plain'
      ? semantic.transparent
      : pressed
        ? semantic.surfaceActive
        : hovered
          ? semantic.surfaceHover
          : variant === 'field'
            ? semantic.field
            : variant === 'subtle'
              ? semantic.surfaceSubtle
              : semantic.surface;

  // On web, CSS `backdrop-filter` alone gives the frosted look — a tint
  // color on top of it muddies the effect, so glass surfaces stay fully
  // transparent there. Native has no backdrop-filter equivalent without a
  // `blurComponent`, so it keeps the tint as a fallback.
  const fill = glassOn && Platform.OS === 'web' ? semantic.transparent : tintFill;

  const shadowName = shadow ?? (variant === 'sheet' ? 'md' : 'none');

  const base: ViewStyle = {
    position: 'relative',
    overflow: Platform.OS === 'web' ? undefined : 'hidden',
    backgroundColor: fill,
    borderRadius: radius,
    borderWidth: showBorder ? theme.borderWidths.thin : 0,
    borderColor: semantic.border,
    ...(rim ? { borderTopColor: semantic.rimStart, borderLeftColor: semantic.rimStart, borderRightColor: semantic.rimEnd, borderBottomColor: semantic.rimEnd } : null),
    ...resolveShadow(theme, shadowName, glassOn),
    ...(Platform.OS === 'web' && glassOn && variant !== 'plain'
      ? ({
          backdropFilter: `blur(${blur}px) saturate(${settings.saturate})`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${settings.saturate})`,
        } as unknown as ViewStyle)
      : null),
    ...surfaceTransition(theme),
  };

  const nativeBlur =
    Platform.OS !== 'web' && glassOn && Blur && variant !== 'plain' ? (
      <Blur
        intensity={Math.min(100, blur * 2.5)}
        tint={theme.mode}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius }}
      />
    ) : null;

  const Component: React.ElementType = as ?? View;
  return (
    <Component ref={ref} style={[base, sx, style]} {...(others as object)}>
      {nativeBlur}
      {children}
    </Component>
  );
}, 'Surface');
