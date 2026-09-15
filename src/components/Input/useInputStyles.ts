import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';
import { resolveRadius } from '../../utils/getToken';
import { webTransition } from '../../utils/motion';
import type { Size } from '../../utils/variants';
import { getInputSizes } from './Input.styles';
import type { InputVariant } from './Input.types';

export interface InputVisualState {
  variant: InputVariant;
  size: Size;
  colorScheme: string;
  rounded: unknown;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  hovered?: boolean;
}

/** Container + text styles shared by Input, Textarea and Select. */
export function getInputStyles(theme: Theme, s: InputVisualState): { container: ViewStyle; text: TextStyle; placeholder: string } {
  const sizes = getInputSizes(theme)[s.size];
  const { semantic } = theme.colors;
  const scale = theme.colors.palette[s.colorScheme] ?? theme.colors.palette.primary;
  const danger = theme.colors.palette.danger;
  const dark = theme.mode === 'dark';

  const focusColor = s.invalid ? danger[dark ? 400 : 500] : scale[dark ? 400 : 500];
  const restBorder = s.invalid ? danger[dark ? 500 : 400] : semantic.border;

  const glassOn = theme.glass.enabled;
  const blur = `blur(${theme.glass.blur}px) saturate(${theme.glass.saturate})`;

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizes.height,
    paddingHorizontal: s.variant === 'flushed' || s.variant === 'unstyled' ? 0 : sizes.paddingX,
    borderRadius: s.variant === 'flushed' || s.variant === 'unstyled' ? 0 : resolveRadius(theme, s.rounded),
    backgroundColor:
      s.variant === 'filled' ? (s.focused ? semantic.field : semantic.surfaceHover) : s.variant === 'unstyled' ? semantic.transparent : semantic.field,
    ...(Platform.OS === 'web' && glassOn && s.variant !== 'unstyled' && s.variant !== 'flushed'
      ? ({ backdropFilter: blur, WebkitBackdropFilter: blur } as unknown as ViewStyle)
      : null),
    ...webTransition(theme, ['background-color', 'border-color', 'box-shadow'], 'fast'),
    borderWidth: s.variant === 'outline' || s.variant === 'filled' ? theme.borderWidths.thin : 0,
    borderBottomWidth: s.variant === 'flushed' ? theme.borderWidths.thin : undefined,
    borderColor: s.focused ? focusColor : s.variant === 'filled' && !s.invalid ? semantic.transparent : s.hovered && !s.invalid ? semantic.borderStrong : restBorder,
    opacity: s.disabled ? theme.opacity.disabled : 1,
    ...(s.focused && (s.variant === 'outline' || s.variant === 'filled')
      ? Platform.OS === 'web'
        ? ({ boxShadow: `0 0 0 1px ${focusColor}` } as ViewStyle)
        : { borderWidth: theme.borderWidths.medium }
      : null),
  };

  const text: TextStyle = {
    flex: 1,
    height: '100%',
    minHeight: sizes.height - 2,
    fontSize: sizes.fontSize,
    color: semantic.text,
    fontFamily: theme.fonts.body,
    paddingVertical: 0,
    // The container draws its own focus ring (border/box-shadow); suppress
    // the browser's native focus outline on the underlying <input> so only
    // one ring shows.
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as unknown as TextStyle) : null),
  };

  return { container, text, placeholder: semantic.textMuted };
}
