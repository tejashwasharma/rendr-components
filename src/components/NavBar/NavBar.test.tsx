import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Menu } from '../Menu/Menu';
import { Text } from '../Text/Text';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'events', label: 'Events' },
    { key: 'profile', label: 'Profile', isDisabled: true },
  ];

  it('renders the bottom pill and only the focused label by default', async () => {
    await renderWithTheme(<NavBar items={items} defaultValue="home" placement="bottom" />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.queryByText('Events')).toBeNull();
  });

  it('switches the active item on press and calls onChange', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<NavBar items={items} defaultValue="home" placement="bottom" onChange={onChange} />);
    await fireEvent.press(screen.getAllByRole('button')[1]);
    expect(onChange).toHaveBeenCalledWith('events');
    expect(screen.getByText('Events')).toBeTruthy();
  });

  it('ignores presses on disabled items', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<NavBar items={items} defaultValue="home" placement="bottom" onChange={onChange} />);
    await fireEvent.press(screen.getAllByRole('button')[2]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows every label and renders leading/trailing content in the top layout', async () => {
    await renderWithTheme(
      <NavBar
        items={items}
        defaultValue="home"
        placement="top"
        leading={<Text>Brand</Text>}
        trailing={<Text>Avatar</Text>}
      />,
    );
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
    expect(screen.getByText('Brand')).toBeTruthy();
    expect(screen.getByText('Avatar')).toBeTruthy();
  });

  it('supports a controlled value', async () => {
    const onChange = jest.fn();
    const { rerender } = await renderWithTheme(
      <NavBar items={items} value="home" placement="top" onChange={onChange} />,
    );
    await fireEvent.press(screen.getAllByRole('button')[1]);
    expect(onChange).toHaveBeenCalledWith('events');
    // Controlled: pressing alone doesn't move the active item without the parent updating `value`.
    rerender(<NavBar items={items} value="events" placement="top" onChange={onChange} />);
    expect(screen.getByText('Events')).toBeTruthy();
  });

  it('opens a dropdown menu instead of navigating for a `menu` item', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <NavBar
        items={[
          { key: 'home', label: 'Home' },
          {
            key: 'profile',
            label: 'Profile',
            menu: (
              <>
                <Menu.Item>Settings</Menu.Item>
                <Menu.Item>Logout</Menu.Item>
              </>
            ),
          },
        ]}
        defaultValue="home"
        placement="top"
        onChange={onChange}
      />,
    );
    expect(screen.queryByText('Settings')).toBeNull();
    await fireEvent.press(screen.getByText('Profile'));
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Logout')).toBeTruthy();
    // A menu trigger isn't a navigable tab — it never reports through onChange.
    expect(onChange).not.toHaveBeenCalled();
  });
});
