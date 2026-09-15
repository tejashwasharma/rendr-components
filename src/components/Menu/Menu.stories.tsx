import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from './Menu';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Menu> = {
  title: 'Overlay/Menu',
  component: Menu,
  argTypes: {
    closeOnSelect: common.bool('Close after an item is pressed.', true),
    placement: { control: 'select', options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'], table: { defaultValue: { summary: "'bottom-start'" } } },
    mode: { control: 'select', options: ['anchored', 'sheet'], description: 'Dropdown vs bottom sheet. Default: anchored on web, sheet on native.' },
    isOpen: common.bool('Controlled open state.'),
    onOpen: common.fn('onOpen'),
    onClose: common.fn('onClose'),
  },
};
export default meta;

export const Dropdown: StoryObj = {
  parameters: {
    code: code`() => {
  const [last, setLast] = useState('—');
  return (
    <VStack spacing={3}>
      <Menu>
        <Menu.Trigger>
          <Button variant="outline" colorScheme="neutral">Actions ▾</Button>
        </Menu.Trigger>
        <Menu.List>
          <Menu.Group title="Document">
            <Menu.Item command="⌘N" onPress={() => setLast('New file')}>New file</Menu.Item>
            <Menu.Item command="⌘O" onPress={() => setLast('Open')}>Open…</Menu.Item>
            <Menu.Item isDisabled>Share (soon)</Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Item colorScheme="danger" onPress={() => setLast('Delete')}>Delete</Menu.Item>
        </Menu.List>
      </Menu>
      <Text size="sm" color="textMuted">Last action: {last}</Text>
    </VStack>
  );
}`,
  },
};

export const SheetMode: StoryObj = {
  parameters: {
    code: code`<Menu mode="sheet">
  <Menu.Trigger>
    <Button>Open as bottom sheet (native default)</Button>
  </Menu.Trigger>
  <Menu.List>
    <Menu.Item>Edit</Menu.Item>
    <Menu.Item>Duplicate</Menu.Item>
    <Menu.Divider />
    <Menu.Item colorScheme="danger">Delete</Menu.Item>
  </Menu.List>
</Menu>`,
  },
};
