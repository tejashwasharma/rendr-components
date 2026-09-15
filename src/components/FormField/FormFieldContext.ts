import { createContext, useContext } from 'react';

export interface FormFieldContextValue {
  id: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  /** Ids of helper/error text nodes, used for `accessibilityDescribedBy` on web. */
  describedBy?: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);

export function useFormField() {
  return useContext(FormFieldContext);
}
