import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { common, code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { defaultPage: 5, totalPages: 20, siblingCount: 1, showFirstLast: true, size: 'md', variant: 'solid', colorScheme: 'primary' },
  argTypes: {
    totalPages: common.number('Total number of pages.'),
    defaultPage: common.number('Initial page (uncontrolled).', 1),
    page: common.hidden,
    siblingCount: common.number('Pages on each side of the current one.', 1),
    boundaryCount: common.number('Pages always shown at the edges.', 1),
    showFirstLast: common.bool('« » buttons.'),
    showPrevNext: common.bool('‹ › buttons.', true),
    size: common.size(['sm', 'md', 'lg'], 'md'),
    variant: common.variant(['solid', 'outline', 'subtle'], 'solid'),
    colorScheme: common.colorScheme(),
    isDisabled: common.bool('Disabled.'),
    onChange: common.fn('onChange'),
  },
};
export default meta;

export const Playground: StoryObj<typeof Pagination> = {};

export const Controlled: StoryObj = {
  parameters: {
    code: code`() => {
  const [page, setPage] = useState(3);
  return (
    <VStack spacing={3}>
      <Pagination page={page} totalPages={12} onChange={setPage} />
      <Text size="sm" color="textMuted">Page {page}</Text>
    </VStack>
  );
}`,
  },
};
