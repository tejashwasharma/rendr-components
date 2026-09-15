import { TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import type { Theme } from '../../theme/types';
import type { Size } from '../../utils/variants';
import type { InputSizeConfig } from './Input.types';

export const StyledInputContainer = styled(View)``;
export const StyledTextInput = styled(TextInput)``;

export function getInputSizes(theme: Theme): Record<Size, InputSizeConfig> {
  const { spacing, fontSizes } = theme;
  return {
    xs: { height: 28, paddingX: spacing[2], fontSize: fontSizes.xs },
    sm: { height: 34, paddingX: spacing[3], fontSize: fontSizes.sm },
    md: { height: 42, paddingX: spacing[3], fontSize: fontSizes.md },
    lg: { height: 50, paddingX: spacing[4], fontSize: fontSizes.lg },
    xl: { height: 58, paddingX: spacing[5], fontSize: fontSizes.xl },
  };
}
