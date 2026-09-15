import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from './Toast';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof ToastProvider> = {
  title: 'Overlay/Toast',
  component: ToastProvider,
  parameters: { docs: { description: { component: 'Mount `ToastProvider` once near the root; call `useToast()` anywhere below it.' } } },
  argTypes: {
    defaultPosition: { control: 'select', options: ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'], table: { defaultValue: { summary: "'top'" } } },
    defaultDuration: common.number('Auto-dismiss ms (null = sticky).', 4000),
    topOffset: common.number('Inset from the top (safe area).', 16),
    maxVisible: common.number('Max toasts per position.', 5),
  },
};
export default meta;

export const Statuses: StoryObj = {
  parameters: {
    code: code`() => {
  const toast = useToast(); // a ToastProvider is mounted around every story
  return (
    <HStack spacing={2} wrap="wrap">
      {['info', 'success', 'warning', 'error', 'neutral'].map((status) => (
        <Button
          key={status}
          variant="subtle"
          colorScheme={status === 'error' ? 'danger' : status === 'info' ? 'primary' : status}
          onPress={() => toast({ title: status + ' toast', description: 'Something happened just now.', status })}
        >
          {status}
        </Button>
      ))}
      <Button variant="outline" onPress={() => toast({ title: 'Undo?', position: 'bottom-right', duration: null, action: { label: 'Undo', onPress: () => toast.closeAll() } })}>
        Persistent with action
      </Button>
      <Button variant="ghost" colorScheme="neutral" onPress={() => toast.closeAll()}>Close all</Button>
    </HStack>
  );
}`,
  },
};
