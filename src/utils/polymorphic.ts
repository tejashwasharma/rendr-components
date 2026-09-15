import type React from 'react';
import { forwardRef } from 'react';

export type AsProp<C extends React.ElementType> = { as?: C };

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

/** Props of a polymorphic component, without `ref`. */
export type PolymorphicComponentProps<C extends React.ElementType, Props = object> = Props &
  AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

/** Props of a polymorphic component, including `ref`. */
export type PolymorphicComponentPropsWithRef<C extends React.ElementType, Props = object> =
  PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };

/**
 * A component whose rendered element can be swapped with `as`, while props are
 * typed against whatever `as` resolves to.
 */
export interface PolymorphicComponent<D extends React.ElementType, Props = object> {
  <C extends React.ElementType = D>(props: PolymorphicComponentPropsWithRef<C, Props>): React.ReactElement | null;
  displayName?: string;
}

/**
 * Typed wrapper around `React.forwardRef` for polymorphic components.
 *
 * ```tsx
 * const Box = forwardRefPolymorphic<typeof View, BoxOwnProps>((props, ref) => ...);
 * <Box as={Pressable} onPress={...} ref={pressableRef} />
 * ```
 */
export function forwardRefPolymorphic<D extends React.ElementType, Props = object>(
  render: (props: PolymorphicComponentProps<D, Props>, ref: PolymorphicRef<D>) => React.ReactElement | null,
  displayName?: string,
): PolymorphicComponent<D, Props> {
  const Component = forwardRef(render as any) as unknown as PolymorphicComponent<D, Props>;
  if (displayName) Component.displayName = displayName;
  return Component;
}
