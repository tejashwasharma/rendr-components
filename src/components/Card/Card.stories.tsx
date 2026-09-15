import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Card> = {
  title: 'Display/Card',
  component: Card,
  argTypes: {
    variant: common.variant(['elevated', 'outline', 'filled', 'unstyled'], 'elevated'),
    padding: common.space('Inner padding.', '4'),
    rounded: common.rounded('lg'),
    shadow: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'], description: 'Shadow for the elevated variant.', table: { defaultValue: { summary: "'md'" } } },
    isPressable: common.bool('Hover/press feedback; renders a Pressable.'),
    isDisabled: common.bool('Disabled (when pressable).'),
    onPress: common.fn('onPress'),
  },
};
export default meta;

export const Sections: StoryObj = {
  parameters: {
    code: code`<Card maxW={360}>
  <Card.Header>
    <HStack justify="space-between">
      <Heading level={5}>Elevated card</Heading>
      <Badge colorScheme="success">Active</Badge>
    </HStack>
  </Card.Header>
  <Card.Body>
    <Text color="textMuted">Cards group related content and actions on one surface.</Text>
  </Card.Body>
  <Card.Footer>
    <Button size="sm" variant="ghost" colorScheme="neutral">Cancel</Button>
    <Button size="sm">Save</Button>
  </Card.Footer>
</Card>`,
  },
};

export const Variants: StoryObj = {
  parameters: {
    code: code`<Grid columns={[1, 3]} gap={4}>
  {['elevated', 'outline', 'filled'].map((v) => (
    <Card key={v} variant={v}>
      <Text weight="semibold">{v}</Text>
      <Text size="sm" color="textMuted">variant="{v}"</Text>
    </Card>
  ))}
</Grid>`,
  },
};

export const Pressable: StoryObj = {
  parameters: {
    code: code`<Card isPressable onPress={() => alert('card pressed')} maxW={360}>
  <HStack spacing={3}>
    <Avatar name="Grace Hopper" status="online" />
    <VStack spacing={0}>
      <Text weight="semibold">Grace Hopper</Text>
      <Text size="sm" color="textMuted">Press me</Text>
    </VStack>
  </HStack>
</Card>`,
  },
};
