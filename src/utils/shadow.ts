import { Platform } from 'react-native';
import type { Theme } from '../theme/types';
import type { ShadowToken } from '../theme/tokens';
import { glassShadows } from '../theme/tokens';

/** Convert a shadow token object into platform-appropriate style. */
export interface GlowHalo {
  /** 1px crisp ring right at the edge. */
  edge: string;
  /** Wider, softer bloom around the sheet. */
  bloom: string;
}

export function shadowToStyle(token: ShadowToken | undefined, insetHighlight?: string, glow?: GlowHalo): Record<string, unknown> {
  if (!token) return {};
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation } = token;

  if (Platform.OS === 'web') {
    const alpha = Math.round(shadowOpacity * 255)
      .toString(16)
      .padStart(2, '0');
    const color = shadowColor.startsWith('#') && shadowColor.length === 7 ? `${shadowColor}${alpha}` : shadowColor;
    const drop = `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${color}`;
    const parts = [
      insetHighlight ? `inset 0 1px 1px ${insetHighlight}` : null,
      drop,
      // A crisp bright edge plus a soft wider bloom — visible as a genuine
      // halo even over a flat dark ground, not just pixel-level noise.
      glow ? `0 0 0 1px ${glow.edge}` : null,
      glow ? `0 0 ${Math.round(shadowRadius * 2.2)}px 0px ${glow.bloom}` : null,
    ].filter(Boolean);
    return { boxShadow: parts.join(', ') };
  }
  if (Platform.OS === 'ios' && glow) {
    // Dark-mode glass: a dark drop is invisible on a dark ground, so iOS uses a faint light halo instead.
    return { shadowColor: '#ffffff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.22, shadowRadius: Math.max(8, shadowRadius / 1.5) };
  }
  if (Platform.OS === 'android') {
    return { elevation, shadowColor };
  }
  return { shadowColor, shadowOffset, shadowOpacity, shadowRadius };
}

/**
 * Resolve a shadow token name (`'sm' | 'md' | 'lg' | 'xl'`) to style. Glass
 * themes use the softer glass shadow set with an inset highlight on web.
 */
export function resolveShadow(theme: Theme, name: unknown, glass?: boolean): Record<string, unknown> {
  if (name === undefined || name === null || name === 'none') return {};
  const key = String(name);
  const useGlass = glass ?? theme.glass?.enabled;
  if (useGlass) {
    const set = glassShadows[theme.mode];
    const token = (set as Record<string, ShadowToken>)[key === 'xl' ? 'lg' : key] ?? set.md;
    // Dark glass adds a light halo so the sheet separates from a dark ground
    // even when nothing colourful sits behind it to show the blur itself.
    return shadowToStyle(
      token,
      theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
      theme.mode === 'dark' ? { edge: 'rgba(255,255,255,0.18)', bloom: 'rgba(255,255,255,0.10)' } : undefined,
    );
  }
  return shadowToStyle(theme.shadows[key]);
}
