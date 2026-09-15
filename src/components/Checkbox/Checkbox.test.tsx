import { useState } from 'react';
import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Checkbox } from './Checkbox';
import { Radio } from '../Radio/Radio';
import { RadioGroup } from '../Radio/RadioGroup';
import { Switch } from '../Switch/Switch';

describe('Checkbox', () => {
  it('toggles uncontrolled', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Checkbox label="Accept" onChange={onChange} />);
    const cb = screen.getByRole('checkbox');
    expect(cb).not.toBeChecked();
    await fireEvent.press(cb);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(cb).toBeChecked();
  });

  it('respects controlled value', async () => {
    function Wrapper() {
      const [v, setV] = useState(false);
      return <Checkbox label={v ? 'on' : 'off'} checked={v} onChange={setV} />;
    }
    await renderWithTheme(<Wrapper />);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(screen.getByText('on')).toBeTruthy();
  });

  it('reports mixed state when indeterminate', async () => {
    await renderWithTheme(<Checkbox isIndeterminate label="Some" />);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('does nothing when disabled', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Checkbox isDisabled label="x" onChange={onChange} />);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('RadioGroup', () => {
  it('selects one value at a time', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <RadioGroup defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const [a, b] = screen.getAllByRole('radio');
    expect(a).toBeChecked();
    await fireEvent.press(b);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(a).not.toBeChecked();
    expect(b).toBeChecked();
  });
});

describe('Switch', () => {
  it('toggles and exposes switch role', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Switch label="Dark mode" onChange={onChange} />);
    const sw = screen.getByRole('switch');
    await fireEvent.press(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw).toBeChecked();
  });
});
