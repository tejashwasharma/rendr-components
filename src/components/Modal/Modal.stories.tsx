import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  argTypes: {
    isOpen: common.bool('Controlled visibility.'),
    onClose: common.fn('onClose'),
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'], table: { defaultValue: { summary: "'md'" } } },
    isCentered: common.bool('Vertically centered.', true),
    closeOnOverlayPress: common.bool('Backdrop press closes.', true),
    closeOnEsc: common.bool('Esc (web) / back (Android) closes.', true),
    scrollBehavior: { control: 'select', options: ['inside', 'outside'], table: { defaultValue: { summary: "'inside'" } } },
    animation: { control: 'select', options: ['fade', 'slide', 'none'], table: { defaultValue: { summary: "'fade'" } } },
  },
};
export default meta;

export const Basic: StoryObj = {
  parameters: {
    code: code`() => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open modal</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="sm">
        <Modal.CloseButton />
        <Modal.Header>Edit profile</Modal.Header>
        <Modal.Body>
          <FormField label="Name"><Input placeholder="Your name" /></FormField>
          <Text size="sm" color="textMuted" mt={3}>Press Esc, the backdrop or × to close.</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" colorScheme="neutral" onPress={() => setOpen(false)}>Cancel</Button>
          <Button onPress={() => setOpen(false)}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}`,
  },
};

export const Sizes: StoryObj = {
  parameters: {
    code: code`() => {
  const [size, setSize] = useState(null);
  return (
    <>
      <HStack spacing={2}>
        {['xs', 'sm', 'md', 'lg', 'xl', 'full'].map((s) => (
          <Button key={s} variant="outline" onPress={() => setSize(s)}>{s}</Button>
        ))}
      </HStack>
      <Modal isOpen={!!size} onClose={() => setSize(null)} size={size ?? 'md'}>
        <Modal.CloseButton />
        <Modal.Header>size="{size}"</Modal.Header>
        <Modal.Body><Text>Modal content</Text></Modal.Body>
      </Modal>
    </>
  );
}`,
  },
};
