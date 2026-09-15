import type React from 'react';
import { createContext, forwardRef, useContext, useMemo } from 'react';
import type { ViewRef } from '../../utils/refs';
import type { ColorScheme } from '../../theme/types';
import type { Size } from '../../utils/variants';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { Stack, type StackOwnProps } from '../Stack/Stack';

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  setValue: (v: string) => void;
  size?: Size;
  colorScheme?: ColorScheme;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);
export const useRadioGroup = () => useContext(RadioGroupContext);

export interface RadioGroupProps extends Omit<StackOwnProps, 'children'> {
  /** Group name; generated if omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: Size;
  colorScheme?: ColorScheme;
  isDisabled?: boolean;
  isInvalid?: boolean;
  children?: React.ReactNode;
  testID?: string;
}

/** Coordinates a set of `Radio` buttons so that only one can be selected. */
export const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, RadioGroupProps>(
  ({ name: nameProp, value, defaultValue, onChange, size, colorScheme, isDisabled, isInvalid, direction = 'column', spacing = 3, children, ...rest }, ref) => {
    const generated = useId('radio');
    const name = nameProp ?? generated;
    const [current, setValue] = useControllableState<string | undefined>({ value, defaultValue, onChange: onChange as (v: string | undefined) => void });
    const ctx = useMemo(
      () => ({ name, value: current, setValue: setValue as (v: string) => void, size, colorScheme, isDisabled, isInvalid }),
      [name, current, setValue, size, colorScheme, isDisabled, isInvalid],
    );
    return (
      <RadioGroupContext.Provider value={ctx}>
        <Stack ref={ref} direction={direction} spacing={spacing} accessibilityRole="radiogroup" {...rest}>
          {children}
        </Stack>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = 'RadioGroup';
