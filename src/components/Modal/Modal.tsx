import type React from 'react';
import { createContext, forwardRef, useContext, useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, Modal as RNModal, Platform, Pressable, ScrollView, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import { useTheme } from '../../hooks/useTheme';
import { useComponentDefaults } from '../../utils/variants';
import { useId } from '../../hooks/useId';
import { Box } from '../Box/Box';
import type { BoxOwnProps } from '../Box/Box.types';
import { Heading } from '../Heading/Heading';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  /** Max width preset. Default `'md'`. */
  size?: ModalSize;
  /** Vertically center the dialog. Default `true`. */
  isCentered?: boolean;
  /** Pressing the dimmed backdrop closes the modal. Default `true`. */
  closeOnOverlayPress?: boolean;
  /** Esc key (web) / hardware back (Android) closes the modal. Default `true`. */
  closeOnEsc?: boolean;
  /** `'inside'` scrolls the body; `'outside'` scrolls the whole dialog. Default `'inside'`. */
  scrollBehavior?: 'inside' | 'outside';
  /** Default `'fade'`. */
  animation?: 'fade' | 'slide' | 'none';
  /** Called after the modal has finished closing. */
  onCloseComplete?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  /** Accessibility label for the dialog; defaults to the `Modal.Header` text. */
  accessibilityLabel?: string;
  testID?: string;
}

interface ModalContextValue {
  onClose: () => void;
  headerId: string;
  bodyId: string;
  scrollBehavior: 'inside' | 'outside';
}
const ModalContext = createContext<ModalContextValue | undefined>(undefined);
export const useModalContext = () => useContext(ModalContext);

const MAX_WIDTH: Record<ModalSize, number | string> = { xs: 320, sm: 400, md: 520, lg: 680, xl: 880, full: '100%' };

type ModalSectionComponent<P = ModalSectionProps> = React.ForwardRefExoticComponent<P & React.RefAttributes<ViewRef>>;

const ModalRoot: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<ViewRef>> = forwardRef<ViewRef, ModalProps>((rawProps, ref) => {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Modal', rawProps);
  const {
    isOpen,
    onClose,
    children,
    size = 'md',
    isCentered = true,
    closeOnOverlayPress = true,
    closeOnEsc = true,
    scrollBehavior = 'inside',
    animation = 'fade',
    onCloseComplete,
    contentStyle,
    overlayStyle,
    accessibilityLabel,
    testID,
  } = props;
  const { width: winW } = useWindowDimensions();
  const headerId = useId('modal-title');
  const bodyId = useId('modal-body');

  // Lock body scroll on web while open.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || !isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc || Platform.OS !== 'web' || typeof document === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEsc, onClose]);

  const ctx = useMemo(() => ({ onClose, headerId, bodyId, scrollBehavior }), [onClose, headerId, bodyId, scrollBehavior]);

  const isFull = size === 'full';
  const maxWidth = MAX_WIDTH[size];
  const dialog = (
    <Surface
      ref={ref}
      shadow="lg"
      rounded={isFull ? 0 : 'xl'}
      bordered={!isFull}
      accessibilityViewIsModal
      accessibilityRole={Platform.OS === 'web' ? ('dialog' as any) : undefined}
      accessibilityLabel={accessibilityLabel}
      aria-modal
      aria-labelledby={headerId}
      aria-describedby={bodyId}
      testID={testID}
      style={[
        {
          width: isFull ? '100%' : Math.min(winW - theme.spacing[8], typeof maxWidth === 'number' ? maxWidth : winW),
          maxHeight: isFull ? '100%' : '90%',
          flex: isFull ? 1 : undefined,
          overflow: 'hidden',
        },
        contentStyle,
      ]}
    >
      {children}
    </Surface>
  );

  const overlayBlur = theme.glass.enabled ? Math.round(theme.glass.blur * theme.glass.overlayBlur) : 0;

  return (
    <RNModal
      transparent
      visible={isOpen}
      animationType={animation}
      onRequestClose={closeOnEsc ? onClose : undefined}
      onDismiss={onCloseComplete}
      statusBarTranslucent
    >
      <ModalContext.Provider value={ctx}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <Pressable
            accessible={false}
            onPress={closeOnOverlayPress ? onClose : undefined}
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.colors.semantic.overlay },
              Platform.OS === 'web' && overlayBlur > 0
                ? ({ backdropFilter: `blur(${overlayBlur}px)`, WebkitBackdropFilter: `blur(${overlayBlur}px)` } as unknown as ViewStyle)
                : null,
              overlayStyle,
            ]}
            testID={testID ? `${testID}-overlay` : undefined}
          />
          {scrollBehavior === 'outside' && !isFull ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: isCentered ? 'center' : 'flex-start', padding: theme.spacing[4] }}
              pointerEvents="box-none"
            >
              {dialog}
            </ScrollView>
          ) : (
            <View pointerEvents="box-none" style={{ flex: 1, alignItems: 'center', justifyContent: isCentered ? 'center' : 'flex-start', padding: isFull ? 0 : theme.spacing[4] }}>
              {dialog}
            </View>
          )}
        </KeyboardAvoidingView>
      </ModalContext.Provider>
    </RNModal>
  );
});
ModalRoot.displayName = 'Modal';

export type ModalSectionProps = BoxOwnProps;

const ModalHeader: ModalSectionComponent = forwardRef<ViewRef, ModalSectionProps>(({ children, style, ...rest }, ref) => {
  const theme = useTheme();
  const ctx = useModalContext();
  return (
    <Box ref={ref} px={5} pt={5} pb={3} direction="row" align="center" justify="space-between" style={style} {...rest}>
      {typeof children === 'string' ? (
        <Heading level={4} nativeID={ctx?.headerId} style={{ flex: 1 }}>
          {children}
        </Heading>
      ) : (
        <View nativeID={ctx?.headerId} style={{ flex: 1 }}>
          {children}
        </View>
      )}
      <View style={{ width: theme.spacing[2] }} />
    </Box>
  );
});
ModalHeader.displayName = 'Modal.Header';

const ModalBody: ModalSectionComponent = forwardRef<ViewRef, ModalSectionProps>(({ children, style, ...rest }, ref) => {
  const ctx = useModalContext();
  const inner = (
    <Box ref={ref} px={5} py={2} nativeID={ctx?.bodyId} style={style} {...rest}>
      {children}
    </Box>
  );
  return ctx?.scrollBehavior === 'inside' ? <ScrollView style={{ flexShrink: 1 }}>{inner}</ScrollView> : inner;
});
ModalBody.displayName = 'Modal.Body';

const ModalFooter: ModalSectionComponent = forwardRef<ViewRef, ModalSectionProps>(({ style, ...rest }, ref) => (
  <Box ref={ref} px={5} pt={3} pb={5} direction="row" align="center" justify="flex-end" gap={2} style={style} {...rest} />
));
ModalFooter.displayName = 'Modal.Footer';

/** A close (×) button that calls the modal's `onClose`. Positioned top-right by default. */
function ModalCloseButton({ style, ...rest }: { style?: StyleProp<ViewStyle>; accessibilityLabel?: string; testID?: string }) {
  const ctx = useModalContext();
  const theme = useTheme();
  return (
    <IconButton
      variant="ghost"
      colorScheme="neutral"
      size="sm"
      isRound
      accessibilityLabel="Close"
      onPress={ctx?.onClose}
      icon={
        <Text size="lg" color="textMuted" style={{ lineHeight: theme.fontSizes.lg + 2 }}>
          ×
        </Text>
      }
      style={[{ position: 'absolute', top: theme.spacing[3], right: theme.spacing[3], zIndex: 1 }, style]}
      {...rest}
    />
  );
}
ModalCloseButton.displayName = 'Modal.CloseButton';

/**
 * A dialog rendered above all content. Compose with `Modal.Header`,
 * `Modal.Body`, `Modal.Footer` and `Modal.CloseButton`.
 */
export const Modal: typeof ModalRoot & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  CloseButton: typeof ModalCloseButton;
} = Object.assign(ModalRoot, { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter, CloseButton: ModalCloseButton });
