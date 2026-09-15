import { useCallback, useRef, useState } from 'react';

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T | (() => T);
  onChange?: (value: T) => void;
}

/**
 * State that works both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`). Returns `[value, setValue]` like `useState`.
 */
export function useControllableState<T>({ value, defaultValue, onChange }: UseControllableStateProps<T>) {
  const [internal, setInternal] = useState<T>(defaultValue as T);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next;
      if (!isControlled) setInternal(resolved);
      if (resolved !== currentRef.current) onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue] as const;
}
