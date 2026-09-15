import type React from 'react';
import { forwardRef, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ViewRef } from '../../utils/refs';
import type { ColorScheme, RadiiToken } from '../../theme/types';
import { useStyleProps, type StyleProps } from '../../utils/styleProps';
import { useComponentDefaults, type Size } from '../../utils/variants';
import { useControllableState } from '../../hooks/useControllableState';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFormField } from '../FormField/FormFieldContext';
import { getInputStyles } from '../Input/useInputStyles';
import type { InputVariant } from '../Input/Input.types';
import { Popover } from '../Popover/Popover';
import { Text } from '../Text/Text';
import { Surface } from '../Surface/Surface';
import { webTransition } from '../../utils/motion';

export interface SelectOption<V extends string | number = string> {
  label: string;
  value: V;
  disabled?: boolean;
  /** Optional element rendered before the label. */
  icon?: React.ReactElement;
}

export interface SelectProps<V extends string | number = string> extends StyleProps {
  style?: StyleProp<ViewStyle>;
  options: SelectOption<V>[];
  value?: V | null;
  defaultValue?: V | null;
  onChange?: (value: V) => void;
  placeholder?: string;
  variant?: InputVariant;
  size?: Size;
  colorScheme?: ColorScheme;
  rounded?: RadiiToken | number;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFullWidth?: boolean;
  /** Force anchored dropdown or bottom sheet. Default: anchored on web, sheet on native. */
  mode?: 'anchored' | 'sheet';
  /** Custom renderer for the selected value. */
  renderValue?: (option: SelectOption<V>) => React.ReactNode;
  /** Custom renderer for each option row. */
  renderOption?: (option: SelectOption<V>, state: { selected: boolean }) => React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

function SelectInner<V extends string | number = string>(rawProps: SelectProps<V>, ref: React.ForwardedRef<ViewRef>) {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const field = useFormField();
  const props = useComponentDefaults(theme, 'Select', rawProps);
  const {
    style,
    options,
    value,
    defaultValue = null,
    onChange,
    placeholder = 'Select…',
    variant = 'outline',
    size = 'md',
    colorScheme = 'primary',
    rounded = 'md',
    isInvalid,
    isDisabled,
    isRequired,
    isFullWidth = true,
    mode,
    renderValue,
    renderOption,
    accessibilityLabel,
    testID,
    ...rest
  } = props;
  const [sx, others] = useStyleProps(theme, breakpoint, rest);
  const [current, setCurrent] = useControllableState<V | null>({ value: value as V | null | undefined, defaultValue, onChange: onChange as (v: V | null) => void });
  const { isOpen, open, close } = useDisclosure();
  const anchorRef = useRef<ViewRef | null>(null);
  const [hovered, setHovered] = useState(false);

  const invalid = !!(isInvalid ?? field?.isInvalid);
  const disabled = !!(isDisabled ?? field?.isDisabled);
  const required = !!(isRequired ?? field?.isRequired);
  const selected = options.find((o) => o.value === current) ?? null;
  const resolvedMode = mode ?? (Platform.OS === 'web' ? 'anchored' : 'sheet');

  const { container, text } = getInputStyles(theme, { variant, size, colorScheme, rounded, focused: isOpen, invalid, disabled, readOnly: false, hovered });

  return (
    <>
      <Pressable
        ref={mergeRefs(ref, anchorRef)}
        accessibilityRole={Platform.OS === 'web' ? ('combobox' as any) : 'button'}
        accessibilityState={{ disabled, expanded: isOpen }}
        accessibilityLabel={accessibilityLabel ?? (selected ? selected.label : placeholder)}
        accessibilityLabelledBy={field?.id ? `${field.id}-label` : undefined}
        aria-invalid={invalid}
        aria-required={required}
        disabled={disabled}
        onPress={open}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        testID={testID}
        style={[
          container,
          { alignSelf: isFullWidth ? 'stretch' : 'flex-start' },
          Platform.OS === 'web' ? ({ cursor: disabled ? 'not-allowed' : 'pointer' } as ViewStyle) : null,
          sx,
          style,
        ]}
        {...(others as object)}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}>
          {selected?.icon}
          {selected && renderValue ? (
            renderValue(selected)
          ) : (
            <Text style={{ fontSize: text.fontSize }} color={selected ? 'text' : 'textMuted'} truncate>
              {selected ? selected.label : placeholder}
            </Text>
          )}
        </View>
        <Chevron color={theme.colors.semantic.textMuted} />
      </Pressable>

      <Popover isOpen={isOpen} onClose={close} anchorRef={anchorRef} mode={resolvedMode} matchAnchorWidth={resolvedMode === 'anchored'} placement="bottom-start" testID={testID ? `${testID}-list` : undefined}>
        <Surface
          accessibilityRole={Platform.OS === 'web' ? ('listbox' as any) : undefined}
          variant={resolvedMode === 'sheet' ? 'plain' : 'sheet'}
          bordered={resolvedMode !== 'sheet'}
          shadow={resolvedMode === 'sheet' ? 'none' : 'lg'}
          rounded="lg"
          style={resolvedMode === 'sheet' ? { paddingHorizontal: theme.spacing[2] } : { paddingVertical: theme.spacing[1] }}
        >
          <ScrollView style={{ maxHeight: 320 }} keyboardShouldPersistTaps="handled">
            {options.map((opt) => {
              const isSel = opt.value === current;
              return (
                <Pressable
                  key={String(opt.value)}
                  accessibilityRole={Platform.OS === 'web' ? ('option' as any) : 'button'}
                  accessibilityState={{ selected: isSel, disabled: !!opt.disabled }}
                  disabled={opt.disabled}
                  onPress={() => {
                    setCurrent(opt.value);
                    close();
                  }}
                  style={({ pressed, hovered: h }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                    paddingHorizontal: theme.spacing[3],
                    paddingVertical: theme.spacing[2.5],
                    marginHorizontal: theme.spacing[1],
                    borderRadius: theme.radii.md,
                    backgroundColor: isSel
                      ? theme.mode === 'dark'
                        ? theme.colors.palette[colorScheme]?.[900] ?? theme.colors.semantic.surfaceHover
                        : theme.colors.palette[colorScheme]?.[50] ?? theme.colors.semantic.surfaceHover
                      : pressed
                        ? theme.colors.semantic.surfaceActive
                        : h
                          ? theme.colors.semantic.surfaceHover
                          : 'transparent',
                    opacity: opt.disabled ? theme.opacity.disabled : 1,
                    ...(Platform.OS === 'web' ? ({ cursor: opt.disabled ? 'not-allowed' : 'pointer' } as ViewStyle) : null),
                    ...webTransition(theme, ['background-color'], 'fast'),
                  })}
                >
                  {renderOption ? (
                    renderOption(opt, { selected: isSel })
                  ) : (
                    <>
                      {opt.icon}
                      <Text style={{ flex: 1 }} weight={isSel ? 'semibold' : 'normal'} color={isSel ? `${colorScheme}.${theme.mode === 'dark' ? 300 : 700}` : 'text'}>
                        {opt.label}
                      </Text>
                      {isSel ? <Text color={`${colorScheme}.${theme.mode === 'dark' ? 300 : 600}`}>✓</Text> : null}
                    </>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Surface>
      </Popover>
    </>
  );
}

function Chevron({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: color,
        transform: [{ rotate: '45deg' }, { translateY: -2 }],
        marginLeft: 8,
      }}
    />
  );
}

/** A single-value picker: dropdown on web, bottom sheet on native. */
export const Select = forwardRef(SelectInner) as <V extends string | number = string>(
  props: SelectProps<V> & { ref?: React.Ref<ViewRef> },
) => React.ReactElement;
(Select as unknown as { displayName: string }).displayName = 'Select';
