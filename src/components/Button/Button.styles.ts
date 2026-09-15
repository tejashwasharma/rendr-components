import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import type { Theme } from '../../theme/types';
import type { Size } from '../../utils/variants';
import type { ButtonSizeConfig } from './Button.types';

export const StyledPressable = styled(Pressable)``;

export function getButtonSizes(theme: Theme): Record<Size, ButtonSizeConfig> {
  const { spacing, fontSizes } = theme;
  return {
    xs: { height: 28, paddingX: spacing[2], fontSize: fontSizes.xs, iconGap: spacing[1], spinner: 12 },
    sm: { height: 34, paddingX: spacing[3], fontSize: fontSizes.sm, iconGap: spacing[1.5], spinner: 14 },
    md: { height: 42, paddingX: spacing[4], fontSize: fontSizes.md, iconGap: spacing[2], spinner: 18 },
    lg: { height: 50, paddingX: spacing[5], fontSize: fontSizes.lg, iconGap: spacing[2], spinner: 20 },
    xl: { height: 58, paddingX: spacing[6], fontSize: fontSizes.xl, iconGap: spacing[2.5], spinner: 24 },
  };
}
