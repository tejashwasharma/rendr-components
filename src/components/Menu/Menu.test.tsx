import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Menu } from './Menu';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { Tooltip } from '../Tooltip/Tooltip';

describe('Menu', () => {
  it('opens from the trigger, selects an item and closes', async () => {
    const onEdit = jest.fn();
    await renderWithTheme(
      <Menu>
        <Menu.Trigger>
          <Button>Actions</Button>
        </Menu.Trigger>
        <Menu.List testID="list">
          <Menu.Group title="Manage">
            <Menu.Item onPress={onEdit}>Edit</Menu.Item>
            <Menu.Divider />
            <Menu.Item colorScheme="danger" isDisabled>
              Delete
            </Menu.Item>
          </Menu.Group>
        </Menu.List>
      </Menu>,
    );
    expect(screen.queryByText('Edit')).toBeNull();
    await fireEvent.press(screen.getByText('Actions'));
    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('Manage')).toBeTruthy();
    await fireEvent.press(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalled();
    expect(screen.queryByText('Edit')).toBeNull();
  });

  it('closes on backdrop press', async () => {
    await renderWithTheme(
      <Menu defaultIsOpen>
        <Menu.Trigger>
          <Button>Actions</Button>
        </Menu.Trigger>
        <Menu.List>
          <Menu.Item>Edit</Menu.Item>
        </Menu.List>
      </Menu>,
    );
    expect(screen.getByText('Edit')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(screen.queryByText('Edit')).toBeNull();
  });
});

describe('Select', () => {
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry', disabled: true },
  ];

  it('shows placeholder, opens list and selects a value', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Select options={options} placeholder="Pick a fruit" onChange={onChange} testID="sel" />);
    expect(screen.getByText('Pick a fruit')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('sel'));
    await fireEvent.press(screen.getByText('Banana'));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
  });

  it('respects a controlled value', async () => {
    await renderWithTheme(<Select options={options} value="apple" />);
    expect(screen.getByText('Apple')).toBeTruthy();
  });
});

describe('Tooltip', () => {
  it('opens on long press on native', async () => {
    await renderWithTheme(
      <Tooltip label="More info" testID="tip">
        <Button>Hover me</Button>
      </Tooltip>,
    );
    expect(screen.queryByText('More info')).toBeNull();
    await fireEvent(screen.getByText('Hover me'), 'longPress');
    expect(screen.getByText('More info')).toBeTruthy();
  });

  it('respects controlled isOpen', async () => {
    await renderWithTheme(
      <Tooltip label="Always" isOpen>
        <Button>x</Button>
      </Tooltip>,
    );
    expect(screen.getByText('Always')).toBeTruthy();
  });
});
