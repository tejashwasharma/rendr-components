import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';
import { code } from '../../../.storybook/argTypes';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  argTypes: {
    columns: { control: 'number', description: 'Number of columns. Responsive: `[1, 2, 4]`. Default 2.' },
    gap: { control: 'text', description: 'Gap between cells (spacing key). Default 4.' },
    rowGap: { control: 'text' },
    columnGap: { control: 'text' },
  },
};
export default meta;

export const Responsive: StoryObj = {
  parameters: {
    code: code`<Grid columns={[1, 2, 4]} gap={3}>
  {Array.from({ length: 8 }).map((_, i) => (
    <Box key={i} p={4} bg="primary.100" rounded="md" align="center">
      <Text color="primary.800">Cell {i + 1}</Text>
    </Box>
  ))}
</Grid>`,
  },
};
