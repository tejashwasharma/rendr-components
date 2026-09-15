import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  argTypes: {
    variant: common.variant(['simple', 'striped', 'outline'], 'simple'),
    size: common.size(['sm', 'md', 'lg'], 'md'),
    isHoverable: common.bool('Highlight rows on hover (web).'),
    columns: { control: false, description: '`{ key, header, render?, width?, flex?, align? }[]` for data-driven mode.' },
    data: { control: false, description: 'Rows for data-driven mode.' },
    onRowPress: common.fn('onRowPress'),
    minWidth: common.number('Min width; enables horizontal scroll.'),
    caption: common.text('Caption above the table.'),
  },
};
export default meta;

export const DataDriven: StoryObj = {
  parameters: {
    code: code`() => {
  const rows = [
    { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active' },
    { id: 2, name: 'Grace Hopper', role: 'Admiral', status: 'active' },
    { id: 3, name: 'Alan Turing', role: 'Cryptanalyst', status: 'inactive' },
  ];
  const [pressed, setPressed] = useState(null);
  return (
    <VStack spacing={3}>
      <Table
        variant="striped"
        isHoverable
        columns={[
          { key: 'name', header: 'Name', flex: 2 },
          { key: 'role', header: 'Role' },
          { key: 'status', header: 'Status', align: 'right',
            render: (r) => <Badge colorScheme={r.status === 'active' ? 'success' : 'neutral'}>{r.status}</Badge> },
        ]}
        data={rows}
        onRowPress={(r) => setPressed(r.name)}
      />
      <Text size="sm" color="textMuted">Pressed: {pressed ?? '—'}</Text>
    </VStack>
  );
}`,
  },
};

export const Compound: StoryObj = {
  parameters: {
    code: code`<Table variant="outline" size="sm">
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Item</Table.HeaderCell>
      <Table.HeaderCell align="right">Qty</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Apples</Table.Cell>
      <Table.Cell align="right">3</Table.Cell>
    </Table.Row>
    <Table.Row isSelected>
      <Table.Cell>Pears (selected)</Table.Cell>
      <Table.Cell align="right">5</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`,
  },
};
