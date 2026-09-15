import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, UIManager, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { useComponentDefaults } from '../../utils/variants';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';
import { webTransition } from '../../utils/motion';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionContextValue {
  expanded: string[];
  toggle: (v: string) => void;
  variant: 'outline' | 'separated' | 'plain';
  id: string;
}
const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);
const ItemContext = createContext<{ value: string; isExpanded: boolean; isDisabled: boolean } | undefined>(undefined);
const useAccordion = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion compound components must be used inside <Accordion>.');
  return ctx;
};
const useItem = () => {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error('Accordion.Button / Accordion.Panel must be inside <Accordion.Item>.');
  return ctx;
};

export interface AccordionProps {
  children?: React.ReactNode;
  /** Expanded item value(s). String when single, array when `allowMultiple`. */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  /** Several items may be open at once. */
  allowMultiple?: boolean;
  /** The open item can be collapsed by pressing it again (single mode). Default `true`. */
  allowToggle?: boolean;
  variant?: 'outline' | 'separated' | 'plain';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function toArray(v: string | string[] | undefined): string[] {
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
}

function AccordionRoot(rawProps: AccordionProps) {
  const theme = useTheme();
  const props = useComponentDefaults(theme, 'Accordion', rawProps);
  const { children, value, defaultValue, onChange, allowMultiple = false, allowToggle = true, variant = 'outline', style, testID } = props;
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: value === undefined ? undefined : toArray(value),
    defaultValue: toArray(defaultValue),
    onChange: (next) => onChange?.(allowMultiple ? next : (next[0] ?? '')),
  });
  const id = useId('accordion');
  const ctx = useMemo<AccordionContextValue>(
    () => ({
      expanded,
      variant,
      id,
      toggle: (v) => {
        if (Platform.OS !== 'web') LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) => {
          const isOpen = prev.includes(v);
          if (allowMultiple) return isOpen ? prev.filter((x) => x !== v) : [...prev, v];
          if (isOpen) return allowToggle ? [] : prev;
          return [v];
        });
      },
    }),
    [expanded, variant, id, setExpanded, allowMultiple, allowToggle],
  );
  return (
    <AccordionContext.Provider value={ctx}>
      <View style={[{ gap: variant === 'separated' ? theme.spacing[2] : 0 }, style]} testID={testID}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}
AccordionRoot.displayName = 'Accordion';

export interface AccordionItemProps {
  value: string;
  children?: React.ReactNode;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function AccordionItem({ value, children, isDisabled = false, style, testID }: AccordionItemProps) {
  const theme = useTheme();
  const { expanded, variant } = useAccordion();
  const isExpanded = expanded.includes(value);
  const ctx = useMemo(() => ({ value, isExpanded, isDisabled }), [value, isExpanded, isDisabled]);
  const { semantic } = theme.colors;
  const frame: ViewStyle = variant === 'outline' ? { borderBottomWidth: theme.borderWidths.thin, borderColor: semantic.border } : {};
  const dim = { opacity: isDisabled ? theme.opacity.disabled : 1 };
  return (
    <ItemContext.Provider value={ctx}>
      {variant === 'separated' ? (
        <Surface shadow="sm" rounded="lg" style={[{ overflow: 'hidden' }, dim, style]} testID={testID}>
          {children}
        </Surface>
      ) : (
        <View style={[frame, dim, style]} testID={testID}>
          {children}
        </View>
      )}
    </ItemContext.Provider>
  );
}
AccordionItem.displayName = 'Accordion.Item';

export interface AccordionButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children?: React.ReactNode;
  /** Hide the chevron. */
  hideIcon?: boolean;
  /** Custom expand/collapse indicator. Receives `isExpanded`. */
  icon?: (state: { isExpanded: boolean }) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function AccordionButton({ children, hideIcon, icon, style, onPress, ...rest }: AccordionButtonProps) {
  const theme = useTheme();
  const { toggle, id } = useAccordion();
  const { value, isExpanded, isDisabled } = useItem();
  const [hovered, setHovered] = useState(false);
  const rotate = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(rotate, { toValue: isExpanded ? 1 : 0, duration: theme.durations.normal, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [isExpanded, rotate, theme.durations.normal]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded, disabled: isDisabled }}
      aria-controls={`${id}-panel-${value}`}
      nativeID={`${id}-button-${value}`}
      disabled={isDisabled}
      onPress={(e) => {
        onPress?.(e);
        toggle(value);
      }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          backgroundColor: pressed ? theme.colors.semantic.surfaceActive : hovered ? theme.colors.semantic.surfaceHover : 'transparent',
          ...(Platform.OS === 'web' ? ({ cursor: isDisabled ? 'not-allowed' : 'pointer', userSelect: 'none' } as ViewStyle) : null),
          ...webTransition(theme, ['background-color'], 'fast'),
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ flex: 1 }}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text weight="medium">{children}</Text>
        ) : (
          children
        )}
      </View>
      {hideIcon ? null : icon ? (
        icon({ isExpanded })
      ) : (
        <Animated.View
          style={{
            width: 9,
            height: 9,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: theme.colors.semantic.textMuted,
            marginRight: 4,
            transform: [{ translateY: -2 }, { rotate: rotate.interpolate({ inputRange: [0, 1], outputRange: ['45deg', '225deg'] }) }],
          }}
        />
      )}
    </Pressable>
  );
}
AccordionButton.displayName = 'Accordion.Button';

export interface AccordionPanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function AccordionPanel({ children, style, testID }: AccordionPanelProps) {
  const theme = useTheme();
  const { id } = useAccordion();
  const { value, isExpanded } = useItem();
  if (!isExpanded) return null;
  return (
    <View
      accessibilityRole={Platform.OS === 'web' ? ('region' as any) : undefined}
      nativeID={`${id}-panel-${value}`}
      aria-labelledby={`${id}-button-${value}`}
      style={[{ paddingHorizontal: theme.spacing[4], paddingBottom: theme.spacing[4], paddingTop: theme.spacing[1] }, style]}
      testID={testID}
    >
      {typeof children === 'string' ? <Text color="textMuted">{children}</Text> : children}
    </View>
  );
}
AccordionPanel.displayName = 'Accordion.Panel';

/**
 * Vertically stacked disclosure sections. Compose: `Accordion`,
 * `Accordion.Item`, `Accordion.Button`, `Accordion.Panel`.
 */
export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem, Button: AccordionButton, Panel: AccordionPanel });
