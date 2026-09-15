import { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Checkbox,
  FormField,
  Heading,
  HStack,
  Input,
  Menu,
  Modal,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  ThemeProvider,
  ToastProvider,
  Tooltip,
  useColorMode,
  useToast,
  VStack,
  createTheme,
} from 'rendr-components';

// App-level theme: override any token; add a `brand` color scheme.
const theme = createTheme({
  colors: {
    palette: {
      brand: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
    },
  },
  radii: { md: 10 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme} mode="system">
      <ToastProvider topOffset={60}>
        <Showcase />
      </ToastProvider>
    </ThemeProvider>
  );
}

function Showcase() {
  const { mode, toggle } = useColorMode();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mode === 'dark' ? '#0f172a' : '#ffffff' }}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <HStack justify="space-between">
          <Heading level={2}>rendr-components</Heading>
          <Switch label={mode} checked={mode === 'dark'} onChange={toggle} />
        </HStack>

        <Section title="Buttons">
          <HStack spacing={2} wrap="wrap">
            <Button>Solid</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="subtle" colorScheme="success">Subtle</Button>
            <Button variant="ghost" colorScheme="danger">Ghost</Button>
            <Button colorScheme="brand" rounded="full">Brand</Button>
            <Button isLoading>Loading</Button>
          </HStack>
        </Section>

        <Section title="Forms">
          <VStack spacing={3}>
            <FormField label="Email" isRequired helperText="We never share it.">
              <Input placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
            </FormField>
            <FormField label="Country">
              <Select
                options={[
                  { label: 'India', value: 'in' },
                  { label: 'United States', value: 'us' },
                  { label: 'Germany', value: 'de' },
                ]}
              />
            </FormField>
            <FormField label="Notes">
              <Textarea placeholder="Grows as you type" minRows={2} />
            </FormField>
            <RadioGroup defaultValue="b" direction="row" spacing={5}>
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
            </RadioGroup>
            <Checkbox label="Remember me" defaultChecked />
          </VStack>
        </Section>

        <Section title="Display">
          <VStack spacing={3}>
            <HStack spacing={2}>
              <Badge colorScheme="success">Active</Badge>
              <Badge variant="solid" colorScheme="brand">Brand</Badge>
              <Badge variant="outline">Outline</Badge>
            </HStack>
            <HStack spacing={3}>
              <Avatar name="Ada Lovelace" status="online" />
              <AvatarGroup max={2}>
                <Avatar name="A B" />
                <Avatar name="C D" />
                <Avatar name="E F" />
              </AvatarGroup>
              <Skeleton width={120} height={20} />
            </HStack>
            <Card>
              <Card.Header>
                <Text weight="semibold">Card</Text>
              </Card.Header>
              <Card.Body>
                <Text color="textMuted">Elevated surface with header, body and footer.</Text>
              </Card.Body>
              <Card.Footer>
                <Button size="sm">Action</Button>
              </Card.Footer>
            </Card>
          </VStack>
        </Section>

        <Section title="Overlays">
          <HStack spacing={2} wrap="wrap">
            <Button onPress={() => setModalOpen(true)}>Modal</Button>
            <Button variant="outline" onPress={() => toast({ title: 'Saved', description: 'Your changes are safe.', status: 'success' })}>
              Toast
            </Button>
            <Menu>
              <Menu.Trigger>
                <Button variant="subtle">Menu</Button>
              </Menu.Trigger>
              <Menu.List>
                <Menu.Item onPress={() => toast({ title: 'Edit' })}>Edit</Menu.Item>
                <Menu.Item onPress={() => toast({ title: 'Duplicate' })}>Duplicate</Menu.Item>
                <Menu.Divider />
                <Menu.Item colorScheme="danger">Delete</Menu.Item>
              </Menu.List>
            </Menu>
            <Tooltip label="Long-press me on device">
              <Button variant="ghost">Tooltip</Button>
            </Tooltip>
          </HStack>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.CloseButton />
            <Modal.Header>Hello</Modal.Header>
            <Modal.Body>
              <Text>This modal is rendered by React Native's Modal on device.</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => setModalOpen(false)}>Done</Button>
            </Modal.Footer>
          </Modal>
        </Section>

        <Section title="Navigation & data">
          <VStack spacing={4}>
            <Tabs defaultValue="one" variant="enclosed" isFitted>
              <Tabs.List>
                <Tabs.Tab value="one">One</Tabs.Tab>
                <Tabs.Tab value="two">Two</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panels>
                <Tabs.Panel value="one">
                  <Text>First panel</Text>
                </Tabs.Panel>
                <Tabs.Panel value="two">
                  <Text>Second panel</Text>
                </Tabs.Panel>
              </Tabs.Panels>
            </Tabs>
            <Accordion defaultValue="a">
              <Accordion.Item value="a">
                <Accordion.Button>Accordion A</Accordion.Button>
                <Accordion.Panel>Content A</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="b">
                <Accordion.Button>Accordion B</Accordion.Button>
                <Accordion.Panel>Content B</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Table
              variant="striped"
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'qty', header: 'Qty', align: 'right' },
              ]}
              data={[
                { id: 1, name: 'Apples', qty: 3 },
                { id: 2, name: 'Pears', qty: 5 },
              ]}
            />
            <Pagination page={page} totalPages={7} onChange={setPage} />
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack spacing={3}>
      <Heading level={5} color="textMuted">
        {title}
      </Heading>
      {children}
    </VStack>
  );
}
