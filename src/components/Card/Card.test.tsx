import { View } from 'react-native';
import { renderWithTheme, screen, fireEvent } from '../../test-utils';
import { Card } from './Card';
import { Badge } from '../Badge/Badge';
import { Avatar, AvatarGroup } from '../Avatar/Avatar';
import { Skeleton, SkeletonText } from '../Skeleton/Skeleton';
import { Text } from '../Text/Text';
import { lightTheme } from '../../theme';

describe('Card', () => {
  it('renders sections', async () => {
    await renderWithTheme(
      <Card testID="card">
        <Card.Header>
          <Text>Head</Text>
        </Card.Header>
        <Card.Body>
          <Text>Body</Text>
        </Card.Body>
        <Card.Footer>
          <Text>Foot</Text>
        </Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Head')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByText('Foot')).toBeTruthy();
    expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: lightTheme.colors.semantic.surface, borderRadius: lightTheme.radii.lg });
  });

  it('becomes pressable with onPress', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Card onPress={onPress} accessibilityLabel="Open" />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('outline variant has a border and no shadow', async () => {
    await renderWithTheme(<Card testID="c" variant="outline" />);
    expect(screen.getByTestId('c')).toHaveStyle({ borderWidth: 1, borderColor: lightTheme.colors.semantic.border });
  });
});

describe('Badge', () => {
  it('renders uppercase text with scheme colors', async () => {
    await renderWithTheme(<Badge colorScheme="success" variant="solid">new</Badge>);
    const t = screen.getByText('new');
    expect(t).toHaveStyle({ textTransform: 'uppercase', color: lightTheme.colors.semantic.white });
  });
});

describe('Avatar', () => {
  it('shows initials when there is no image', async () => {
    await renderWithTheme(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeTruthy();
    expect(screen.getByLabelText('Ada Lovelace')).toBeTruthy();
  });

  it('renders a status dot', async () => {
    await renderWithTheme(<Avatar name="A" status="online" testID="av" />);
    expect(screen.getByTestId('av-status')).toHaveStyle({ backgroundColor: lightTheme.colors.palette.success[500] });
  });

  it('AvatarGroup truncates with +N', async () => {
    await renderWithTheme(
      <AvatarGroup max={2}>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="E F" />
        <Avatar name="G H" />
      </AvatarGroup>,
    );
    expect(screen.getByText('+2')).toBeTruthy();
    expect(screen.queryByText('EF')).toBeNull();
  });
});

describe('Skeleton', () => {
  it('renders placeholder until loaded', async () => {
    const { rerender } = await renderWithTheme(
      <Skeleton testID="sk" isLoaded={false}>
        <Text>Ready</Text>
      </Skeleton>,
    );
    expect(screen.getByTestId('sk', { includeHiddenElements: true })).toBeTruthy();
    await rerender(
      <Skeleton testID="sk" isLoaded>
        <Text>Ready</Text>
      </Skeleton>,
    );
    expect(screen.queryByTestId('sk', { includeHiddenElements: true })).toBeNull();
    expect(screen.getByText('Ready')).toBeTruthy();
  });

  it('SkeletonText renders the requested number of lines', async () => {
    await renderWithTheme(<SkeletonText noOfLines={4} testID="line" />);
    expect(screen.getAllByTestId('line', { includeHiddenElements: true })).toHaveLength(4);
  });

  it('accepts a custom child fallback', async () => {
    await renderWithTheme(<Avatar fallback={<View testID="fb" />} />);
    expect(screen.getByTestId('fb')).toBeTruthy();
  });
});
