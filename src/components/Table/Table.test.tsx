import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Table } from './Table';
import { Pagination, getPaginationRange } from '../Pagination/Pagination';
import { Text } from '../Text/Text';

describe('Table', () => {
  it('renders compound rows and cells', async () => {
    await renderWithTheme(
      <Table variant="striped">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell align="right">Qty</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Apple</Table.Cell>
            <Table.Cell align="right">3</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Pear</Table.Cell>
            <Table.Cell align="right">5</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Pear')).toBeTruthy();
  });

  it('renders data-driven tables and handles row press', async () => {
    const onRowPress = jest.fn();
    await renderWithTheme(
      <Table
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'qty', header: 'Qty', render: (r: any) => <Text>{r.qty * 2}</Text> },
        ]}
        data={[
          { id: 1, name: 'Apple', qty: 3 },
          { id: 2, name: 'Pear', qty: 5 },
        ]}
        onRowPress={onRowPress}
      />,
    );
    expect(screen.getByText('10')).toBeTruthy();
    await fireEvent.press(screen.getByText('Pear'));
    expect(onRowPress).toHaveBeenCalledWith(expect.objectContaining({ name: 'Pear' }), 1);
  });
});

describe('Pagination', () => {
  it('computes ranges with ellipses', () => {
    const pages = (p: number, t: number) => getPaginationRange(p, t).map((i) => (i.type === 'page' ? i.page : '…'));
    expect(pages(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pages(1, 10)).toEqual([1, 2, 3, 4, 5, '…', 10]);
    expect(pages(5, 10)).toEqual([1, '…', 4, 5, 6, '…', 10]);
    expect(pages(10, 10)).toEqual([1, '…', 6, 7, 8, 9, 10]);
  });

  it('navigates and disables edges', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<Pagination defaultPage={1} totalPages={10} onChange={onChange} showFirstLast />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    await fireEvent.press(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenCalledWith(2);
    await fireEvent.press(screen.getByLabelText('Last page'));
    expect(onChange).toHaveBeenCalledWith(10);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Page 10')).toBeSelected();
  });
});
