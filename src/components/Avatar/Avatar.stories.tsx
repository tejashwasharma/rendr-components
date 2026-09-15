import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Avatar> = {
  title: 'Display/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace', size: 'md', shape: 'circle' },
  argTypes: {
    name: common.text('Used for initials and the a11y label.'),
    src: common.text('Image URL.'),
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'], table: { defaultValue: { summary: "'md'" } } },
    shape: { control: 'select', options: ['circle', 'rounded', 'square'], table: { defaultValue: { summary: "'circle'" } } },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy', 'away'], description: 'Presence dot.' },
    colorScheme: common.colorScheme('derived from name'),
    showBorder: common.bool('Border in the background color (for groups).'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Avatar> = {};

export const SizesAndStatus: StoryObj = {
  parameters: {
    code: code`<VStack spacing={4}>
  <HStack spacing={3} align="flex-end">
    {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((s) => <Avatar key={s} size={s} name="Ada Lovelace" />)}
  </HStack>
  <HStack spacing={3}>
    <Avatar name="Alan Turing" src="https://i.pravatar.cc/100?img=12" status="online" />
    <Avatar name="Grace Hopper" shape="rounded" status="busy" />
    <Avatar name="Linus" shape="square" status="away" colorScheme="warning" />
    <Avatar status="offline" />
  </HStack>
</VStack>`,
  },
};

export const Group: StoryObj = {
  parameters: {
    code: code`<AvatarGroup max={3}>
  <Avatar name="A B" />
  <Avatar name="C D" />
  <Avatar name="E F" />
  <Avatar name="G H" />
  <Avatar name="I J" />
</AvatarGroup>`,
  },
};
