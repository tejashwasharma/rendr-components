import type { Theme } from '../../theme/types';
import type { Size } from '../../utils/variants';

export interface ControlSizeConfig {
  box: number;
  fontSize: number;
  gap: number;
}

/** Shared sizing for Checkbox and Radio. */
export function getControlSizes(theme: Theme): Record<Size, ControlSizeConfig> {
  const { fontSizes, spacing } = theme;
  return {
    xs: { box: 14, fontSize: fontSizes.xs, gap: spacing[1.5] },
    sm: { box: 16, fontSize: fontSizes.sm, gap: spacing[2] },
    md: { box: 20, fontSize: fontSizes.md, gap: spacing[2] },
    lg: { box: 24, fontSize: fontSizes.lg, gap: spacing[2.5] },
    xl: { box: 28, fontSize: fontSizes.xl, gap: spacing[3] },
  };
}
