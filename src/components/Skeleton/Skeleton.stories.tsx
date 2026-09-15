import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Skeleton> = {
  title: 'Display/Skeleton',
  component: Skeleton,
  args: { width: 240, height: 16, rounded: 'md', animate: true },
  argTypes: {
    width: common.text('Width (px or "50%").', "'100%'"),
    height: common.text('Height.', '16'),
    rounded: common.rounded(),
    animate: common.bool('Pulse animation.', true),
    isLoaded: common.bool('Render children instead of the placeholder.'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Skeleton> = {};

export const Composition: StoryObj = {
  parameters: {
    code: code`() => {
  const [loaded, setLoaded] = useState(false);
  return (
    <VStack spacing={4} maxW={380}>
      <Switch label="Loaded" checked={loaded} onChange={setLoaded} />
      <HStack spacing={3}>
        <SkeletonCircle size={48} isLoaded={loaded}><Avatar name="Ada Lovelace" size="lg" /></SkeletonCircle>
        <VStack spacing={2} flex={1}>
          <Skeleton height={14} width="60%" isLoaded={loaded}><Text weight="semibold">Ada Lovelace</Text></Skeleton>
          <Skeleton height={12} width="40%" isLoaded={loaded}><Text size="sm" color="textMuted">Engineer</Text></Skeleton>
        </VStack>
      </HStack>
      <SkeletonText noOfLines={3} isLoaded={loaded}>
        <Text>Augusta Ada King, Countess of Lovelace, was an English mathematician and writer.</Text>
      </SkeletonText>
    </VStack>
  );
}`,
  },
};
