import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavBar } from './NavBar';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof NavBar> = {
  title: 'Navigation/NavBar',
  component: NavBar,
  argTypes: {
    colorScheme: common.colorScheme(),
    topAt: { control: 'select', options: ['base', 'sm', 'md', 'lg', 'xl'], table: { defaultValue: { summary: "'md'" } } },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'], table: { defaultValue: { summary: "'auto'" } } },
    defaultValue: common.text('Initial active item key.'),
    onChange: common.fn('onChange'),
  },
};
export default meta;

// Every snippet below defines its own local `Glyph` (stand-in for an icon
// library, e.g. lucide-react-native) and `items` — the live-code panel
// executes `code` verbatim with only the library's exports and a few React
// Native primitives in scope, so nothing outside the snippet is reachable.

export const Bottom: StoryObj<typeof NavBar> = {
  parameters: {
    code: code`() => {
  const Glyph = ({ glyph, color, size = 22 }) => (
    <RNText style={{ fontSize: size, lineHeight: size + 2, color }}>{glyph}</RNText>
  );
  const items = [
    { key: 'home', label: 'Home', icon: <Glyph glyph="⌂" /> },
    { key: 'events', label: 'Events', icon: <Glyph glyph="📅" /> },
    { key: 'tournaments', label: 'Tournaments', icon: <Glyph glyph="🏆" /> },
    { key: 'profile', label: 'Profile', avatar: { name: 'Tej Sharma' }, align: 'end' },
  ];
  return (
    <View style={{ height: 220, borderRadius: 12, overflow: 'hidden' }}>
      <NavBar items={items} defaultValue="events" placement="bottom" />
    </View>
  );
}`,
  },
};

export const Top: StoryObj<typeof NavBar> = {
  parameters: {
    code: code`() => {
  const Glyph = ({ glyph, color, size = 22 }) => (
    <RNText style={{ fontSize: size, lineHeight: size + 2, color }}>{glyph}</RNText>
  );
  const items = [
    { key: 'home', label: 'Home', icon: <Glyph glyph="⌂" /> },
    { key: 'events', label: 'Events', icon: <Glyph glyph="📅" /> },
    { key: 'tournaments', label: 'Tournaments', icon: <Glyph glyph="🏆" /> },
    { key: 'profile', label: 'Profile', avatar: { name: 'Tej Sharma' }, align: 'end' },
  ];
  return (
    <NavBar
      items={items}
      defaultValue="events"
      placement="top"
      leading={<Heading size="md">Rendr</Heading>}
    />
  );
}`,
  },
};

export const Responsive: StoryObj<typeof NavBar> = {
  parameters: {
    code: code`() => {
  // placement="auto" (the default) — top above the "md" breakpoint, a
  // floating bottom pill below it. Resize the canvas to see it flip.
  const Glyph = ({ glyph, color, size = 22 }) => (
    <RNText style={{ fontSize: size, lineHeight: size + 2, color }}>{glyph}</RNText>
  );
  const items = [
    { key: 'home', label: 'Home', icon: <Glyph glyph="⌂" /> },
    { key: 'events', label: 'Events', icon: <Glyph glyph="📅" /> },
    { key: 'tournaments', label: 'Tournaments', icon: <Glyph glyph="🏆" /> },
    { key: 'profile', label: 'Profile', avatar: { name: 'Tej Sharma' }, align: 'end' },
  ];
  return (
    <View style={{ height: 260 }}>
      <NavBar items={items} defaultValue="home" leading={<Heading size="md">Rendr</Heading>} />
    </View>
  );
}`,
  },
};

// Regular items "redirect": onChange swaps the visible page content, same as
// a router's onNavigate would. Profile isn't a page — it's a `menu` item, so
// pressing it opens a dropdown instead. The menu's placement is requested as
// "bottom-*" in both stories; `Menu`/`Popover` already flip it to a "dropup"
// on their own whenever there isn't room below the trigger — on the Top bar
// there's plenty of room, so it opens downward; on the Bottom bar the
// trigger sits near the real bottom of the screen, so it flips upward and
// re-aligns to stay on screen. Nothing here special-cases which direction
// to use — the flip is the same `Popover` logic every anchored menu gets.

export const TopWithProfileMenu: StoryObj<typeof NavBar> = {
  parameters: {
    code: code`() => {
  const Glyph = ({ glyph, color, size = 22 }) => (
    <RNText style={{ fontSize: size, lineHeight: size + 2, color }}>{glyph}</RNText>
  );
  const pages = {
    home: 'Welcome home.',
    events: 'Upcoming events near you.',
    tournaments: 'Live tournament brackets.',
  };
  const [page, setPage] = useState('home');
  const items = [
    { key: 'home', label: 'Home', icon: <Glyph glyph="⌂" /> },
    { key: 'events', label: 'Events', icon: <Glyph glyph="📅" /> },
    { key: 'tournaments', label: 'Tournaments', icon: <Glyph glyph="🏆" /> },
    {
      key: 'profile',
      label: 'Profile',
      avatar: { name: 'Tej Sharma' },
      align: 'end',
      menu: (
        <>
          <Menu.Item>Account</Menu.Item>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Divider />
          <Menu.Item colorScheme="danger">Sign out</Menu.Item>
        </>
      ),
    },
  ];
  return (
    <View style={{ height: 320 }}>
      <NavBar items={items} value={page} onChange={setPage} placement="top" leading={<Heading size="md">Rendr</Heading>} />
      <View style={{ padding: 24 }}>
        <Text size="lg" weight="semibold">{pages[page]}</Text>
        <Text size="sm" color="textMuted" style={{ marginTop: 4 }}>
          Pressing Home/Events/Tournaments "redirects" here via onChange. Profile opens a dropdown — plenty of room below, so it doesn't flip.
        </Text>
      </View>
    </View>
  );
}`,
  },
};

export const BottomWithProfileMenu: StoryObj<typeof NavBar> = {
  parameters: {
    code: code`() => {
  const Glyph = ({ glyph, color, size = 22 }) => (
    <RNText style={{ fontSize: size, lineHeight: size + 2, color }}>{glyph}</RNText>
  );
  const pages = {
    home: 'Welcome home.',
    events: 'Upcoming events near you.',
    tournaments: 'Live tournament brackets.',
  };
  const [page, setPage] = useState('home');
  const items = [
    { key: 'home', label: 'Home', icon: <Glyph glyph="⌂" /> },
    { key: 'events', label: 'Events', icon: <Glyph glyph="📅" /> },
    { key: 'tournaments', label: 'Tournaments', icon: <Glyph glyph="🏆" /> },
    {
      key: 'profile',
      label: 'Profile',
      avatar: { name: 'Tej Sharma' },
      menu: (
        <>
          <Menu.Item>Account</Menu.Item>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Divider />
          <Menu.Item colorScheme="danger">Sign out</Menu.Item>
        </>
      ),
    },
  ];
  return (
    // A fixed, phone-sized "screen" — NavBar's bottom pill anchors to its
    // bottom edge, same as it would to a real device's. There's genuinely no
    // room below it here, which is what makes the menu flip up.
    <View style={{ height: 560, padding: 24 }}>
      <Text size="lg" weight="semibold">{pages[page]}</Text>
      <Text size="sm" color="textMuted" style={{ marginTop: 4 }}>
        The bottom pill floats near the true bottom of the screen, so Profile's
        menu has nowhere to go below it — Popover flips it into a dropup and
        re-aligns it to stay on screen, with no extra placement logic here.
      </Text>
      <NavBar items={items} value={page} onChange={setPage} placement="bottom" />
    </View>
  );
}`,
  },
};
