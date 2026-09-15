import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Accordion> = {
  title: 'Navigation/Accordion',
  component: Accordion,
  argTypes: {
    allowMultiple: common.bool('Several items open at once.'),
    allowToggle: common.bool('Collapse the open item by pressing again.', true),
    variant: common.variant(['outline', 'separated', 'plain'], 'outline'),
    defaultValue: common.text('Initially open value(s).'),
    onChange: common.fn('onChange'),
  },
};
export default meta;

export const Single: StoryObj = {
  parameters: {
    code: code`<Accordion defaultValue="1">
  <Accordion.Item value="1">
    <Accordion.Button>What is rendr-components?</Accordion.Button>
    <Accordion.Panel>A universal React component library for iOS, Android and web.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="2">
    <Accordion.Button>Can I override the theme?</Accordion.Button>
    <Accordion.Panel>Yes — wrap your app in ThemeProvider and pass a partial theme.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="3" isDisabled>
    <Accordion.Button>Disabled item</Accordion.Button>
    <Accordion.Panel>Hidden</Accordion.Panel>
  </Accordion.Item>
</Accordion>`,
  },
};

export const SeparatedMultiple: StoryObj = {
  parameters: {
    code: code`<Accordion variant="separated" allowMultiple defaultValue={['a']}>
  <Accordion.Item value="a">
    <Accordion.Button>Separated, multiple</Accordion.Button>
    <Accordion.Panel>Several items can be open at once.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="b">
    <Accordion.Button>Another</Accordion.Button>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>`,
  },
};
