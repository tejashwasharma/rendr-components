import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  argTypes: {
    variant: common.variant(['line', 'enclosed', 'pills', 'soft'], 'line'),
    size: common.size(),
    colorScheme: common.colorScheme(),
    isFitted: common.bool('Tabs stretch to fill the list.'),
    isLazy: common.bool('Mount a panel only once activated.'),
    orientation: { control: 'select', options: ['horizontal', 'vertical'], table: { defaultValue: { summary: "'horizontal'" } } },
    defaultValue: common.text('Initial tab value.'),
    onChange: common.fn('onChange'),
  },
};
export default meta;

const tabs = (variant: string, extra = '') => code`<Tabs defaultValue="overview" variant="${variant}"${extra}>
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
    <Tabs.Tab value="off" isDisabled>Disabled</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel value="overview"><Text>Overview — use ← → keys on web.</Text></Tabs.Panel>
    <Tabs.Panel value="analytics"><Text>Analytics panel</Text></Tabs.Panel>
    <Tabs.Panel value="settings"><Text>Settings panel</Text></Tabs.Panel>
  </Tabs.Panels>
</Tabs>`;

export const Line: StoryObj = { parameters: { code: tabs('line') } };
export const Enclosed: StoryObj = { parameters: { code: tabs('enclosed', ' isFitted') } };
export const Pills: StoryObj = { parameters: { code: tabs('pills') } };
export const Soft: StoryObj = { parameters: { code: tabs('soft', ' colorScheme="secondary"') } };
export const Vertical: StoryObj = { parameters: { code: tabs('line', ' orientation="vertical"') } };
