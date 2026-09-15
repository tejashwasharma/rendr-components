import { useState } from 'react';
import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';

function Demo({ closeOnOverlayPress = true }: { closeOnOverlayPress?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} testID="modal" closeOnOverlayPress={closeOnOverlayPress}>
        <Modal.CloseButton />
        <Modal.Header>Title</Modal.Header>
        <Modal.Body>
          <Text>Body text</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={() => setOpen(false)}>Done</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('opens and closes via footer button', async () => {
    await renderWithTheme(<Demo />);
    expect(screen.queryByText('Body text')).toBeNull();
    await fireEvent.press(screen.getByText('Open'));
    expect(screen.getByText('Body text')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();
    await fireEvent.press(screen.getByText('Done'));
    expect(screen.queryByText('Body text')).toBeNull();
  });

  it('closes on overlay press and via close button', async () => {
    await renderWithTheme(<Demo />);
    await fireEvent.press(screen.getByText('Open'));
    await fireEvent.press(screen.getByTestId('modal-overlay'));
    expect(screen.queryByText('Body text')).toBeNull();
    await fireEvent.press(screen.getByText('Open'));
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(screen.queryByText('Body text')).toBeNull();
  });

  it('keeps open when overlay press is disabled', async () => {
    await renderWithTheme(<Demo closeOnOverlayPress={false} />);
    await fireEvent.press(screen.getByText('Open'));
    await fireEvent.press(screen.getByTestId('modal-overlay'));
    expect(screen.getByText('Body text')).toBeTruthy();
  });
});
