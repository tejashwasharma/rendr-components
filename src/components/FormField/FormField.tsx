import type React from 'react';
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import { useId } from '../../hooks/useId';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { Text } from '../Text/Text';
import { FormFieldContext } from './FormFieldContext';

export interface FormFieldProps extends BoxOwnProps {
  /** Label shown above the control. */
  label?: React.ReactNode;
  /** Neutral hint shown below the control. */
  helperText?: React.ReactNode;
  /** Error shown below the control when `isInvalid`. */
  errorText?: React.ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  /** Custom id for the control; generated if omitted. */
  id?: string;
  /** Label placement. Default `'top'`. */
  labelPosition?: 'top' | 'left';
  testID?: string;
}

/**
 * Wraps a form control with a label, helper text and error text, and shares
 * `isInvalid` / `isDisabled` / `isRequired` state with the control inside it.
 */
export const FormField: React.ForwardRefExoticComponent<FormFieldProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, FormFieldProps>(
  ({ label, helperText, errorText, isInvalid, isDisabled, isRequired, isReadOnly, id: idProp, labelPosition = 'top', children, ...rest }, ref) => {
    const generated = useId('field');
    const id = idProp ?? generated;
    const showError = !!(isInvalid && errorText);
    const value = useMemo(
      () => ({ id, isInvalid, isDisabled, isRequired, isReadOnly, describedBy: showError ? `${id}-error` : helperText ? `${id}-helper` : undefined }),
      [id, isInvalid, isDisabled, isRequired, isReadOnly, showError, helperText],
    );

    const labelNode = label ? (
      <Text
        nativeID={`${id}-label`}
        size="sm"
        weight="medium"
        color={isDisabled ? 'textMuted' : 'text'}
        mb={labelPosition === 'top' ? 1.5 : 0}
        mr={labelPosition === 'left' ? 3 : 0}
      >
        {label}
        {isRequired ? (
          <Text size="sm" color="danger.500">
            {' *'}
          </Text>
        ) : null}
      </Text>
    ) : null;

    return (
      <FormFieldContext.Provider value={value}>
        <Box ref={ref} {...rest}>
          {labelPosition === 'left' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {labelNode}
              <View style={{ flex: 1 }}>{children}</View>
            </View>
          ) : (
            <>
              {labelNode}
              {children}
            </>
          )}
          {showError ? (
            <Text nativeID={`${id}-error`} size="sm" color="danger.500" mt={1.5} accessibilityLiveRegion="polite">
              {errorText}
            </Text>
          ) : helperText ? (
            <Text nativeID={`${id}-helper`} size="sm" color="textMuted" mt={1.5}>
              {helperText}
            </Text>
          ) : null}
        </Box>
      </FormFieldContext.Provider>
    );
  },
);
FormField.displayName = 'FormField';
