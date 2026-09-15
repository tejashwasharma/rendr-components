import { renderWithTheme, screen, fireEvent, act } from '../../test-utils';
import { Tabs } from './Tabs';
import { Accordion } from '../Accordion/Accordion';
import { Text } from '../Text/Text';
import { ToastProvider, useToast } from '../Toast/Toast';
import { Button } from '../Button/Button';

describe('Tabs', () => {
  const ui = (props: any = {}) => (
    <Tabs defaultValue="a" {...props}>
      <Tabs.List>
        <Tabs.Tab value="a">Tab A</Tabs.Tab>
        <Tabs.Tab value="b">Tab B</Tabs.Tab>
        <Tabs.Tab value="c" isDisabled>
          Tab C
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="a" testID="panel-a">
          <Text>Panel A</Text>
        </Tabs.Panel>
        <Tabs.Panel value="b" testID="panel-b">
          <Text>Panel B</Text>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );

  it('switches panels on tab press', async () => {
    const onChange = jest.fn();
    await renderWithTheme(ui({ onChange }));
    const [a, b] = screen.getAllByRole('tab');
    expect(a).toBeSelected();
    expect(screen.getByTestId('panel-b', { includeHiddenElements: true })).toHaveStyle({ display: 'none' });
    await fireEvent.press(b);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(b).toBeSelected();
    expect(screen.getByTestId('panel-a', { includeHiddenElements: true })).toHaveStyle({ display: 'none' });
  });

  it('lazy mounts panels on first activation', async () => {
    await renderWithTheme(ui({ isLazy: true }));
    expect(screen.queryByTestId('panel-b')).toBeNull();
    await fireEvent.press(screen.getAllByRole('tab')[1]);
    expect(screen.getByTestId('panel-b')).toBeTruthy();
  });

  it('ignores disabled tabs', async () => {
    await renderWithTheme(ui());
    await fireEvent.press(screen.getAllByRole('tab')[2]);
    expect(screen.getAllByRole('tab')[0]).toBeSelected();
  });
});

describe('Accordion', () => {
  const ui = (props: any = {}) => (
    <Accordion {...props}>
      <Accordion.Item value="one">
        <Accordion.Button>One</Accordion.Button>
        <Accordion.Panel>Panel one</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Button>Two</Accordion.Button>
        <Accordion.Panel>Panel two</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );

  it('opens one item at a time by default and toggles', async () => {
    await renderWithTheme(ui());
    await fireEvent.press(screen.getByText('One'));
    expect(screen.getByText('Panel one')).toBeTruthy();
    await fireEvent.press(screen.getByText('Two'));
    expect(screen.queryByText('Panel one')).toBeNull();
    expect(screen.getByText('Panel two')).toBeTruthy();
    await fireEvent.press(screen.getByText('Two'));
    expect(screen.queryByText('Panel two')).toBeNull();
  });

  it('allows multiple with allowMultiple', async () => {
    const onChange = jest.fn();
    await renderWithTheme(ui({ allowMultiple: true, onChange }));
    await fireEvent.press(screen.getByText('One'));
    await fireEvent.press(screen.getByText('Two'));
    expect(screen.getByText('Panel one')).toBeTruthy();
    expect(screen.getByText('Panel two')).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith(['one', 'two']);
  });

  it('exposes expanded state', async () => {
    await renderWithTheme(ui({ defaultValue: 'one' }));
    expect(screen.getByText('One').parent?.parent).toBeTruthy();
    expect(screen.getAllByRole('button')[0]).toBeExpanded();
  });
});

describe('Toast', () => {
  function Demo() {
    const toast = useToast();
    return <Button onPress={() => toast({ title: 'Saved', description: 'All good', status: 'success', duration: null })}>Notify</Button>;
  }

  it('shows and dismisses a toast', async () => {
    await renderWithTheme(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByText('Notify'));
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('All good')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Dismiss'));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('auto-dismisses after duration', async () => {
    jest.useFakeTimers();
    function Quick() {
      const toast = useToast();
      return <Button onPress={() => toast({ title: 'Bye', duration: 500 })}>Go</Button>;
    }
    await renderWithTheme(
      <ToastProvider>
        <Quick />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByText('Go'));
    expect(screen.getByText('Bye')).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
    expect(screen.queryByText('Bye')).toBeNull();
    jest.useRealTimers();
  });
});
