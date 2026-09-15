import { useCallback } from 'react';
import { useControllableState } from './useControllableState';

export interface UseDisclosureProps {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/** Open/close state for modals, menus, tooltips and the like. */
export function useDisclosure(props: UseDisclosureProps = {}) {
  const { isOpen: isOpenProp, defaultIsOpen = false, onOpen, onClose } = props;
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: isOpenProp,
    defaultValue: defaultIsOpen,
    onChange: (next) => (next ? onOpen?.() : onClose?.()),
  });
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggle = useCallback(() => setIsOpen((v) => !v), [setIsOpen]);
  return { isOpen, open, close, toggle, setIsOpen };
}
