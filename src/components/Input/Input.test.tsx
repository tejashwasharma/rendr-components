import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Input } from './Input';
import { Textarea } from '../Textarea/Textarea';
import { FormField } from '../FormField/FormField';
import { lightTheme } from '../../theme';

describe('Input', () => {
  it('handles text changes', async () => {
    const onChangeText = jest.fn();
    await renderWithTheme(<Input placeholder="Email" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.c');
    expect(onChangeText).toHaveBeenCalledWith('a@b.c');
  });

  it('is not editable when disabled or read-only', async () => {
    await renderWithTheme(
      <>
        <Input testID="d" isDisabled />
        <Input testID="r" isReadOnly />
      </>,
    );
    expect(screen.getByTestId('d').props.editable).toBe(false);
    expect(screen.getByTestId('r').props.editable).toBe(false);
  });

  it('shows a danger border when invalid', async () => {
    await renderWithTheme(<Input testID="i" isInvalid />);
    expect(screen.getByTestId('i-container')).toHaveStyle({ borderColor: lightTheme.colors.palette.danger[400] });
  });

  it('inherits invalid/disabled/required state from FormField and renders error text', async () => {
    await renderWithTheme(
      <FormField label="Name" isInvalid errorText="Required" helperText="hint" isRequired>
        <Input testID="i" />
      </FormField>,
    );
    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.queryByText('hint')).toBeNull();
    expect(screen.getByTestId('i').props['aria-invalid']).toBe(true);
    expect(screen.getByTestId('i').props['aria-required']).toBe(true);
    expect(screen.getByText('Name', { exact: false })).toBeTruthy();
  });
});

describe('Textarea', () => {
  it('renders multiline and grows with content', async () => {
    await renderWithTheme(<Textarea testID="t" minRows={2} maxRows={4} />);
    const el = screen.getByTestId('t');
    expect(el.props.multiline).toBe(true);
    const heightOf = (node: any) => node.props.style.filter((s: any) => s && typeof s.height === 'number').pop().height;
    const before = heightOf(el);
    await fireEvent(el, 'contentSizeChange', { nativeEvent: { contentSize: { height: 500 } } });
    const after = heightOf(screen.getByTestId('t'));
    expect(after).toBeGreaterThan(before);
  });
});
