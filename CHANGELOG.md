# Changelog

## 0.1.0 (unreleased)

- Initial release: theme system (tokens, light/dark/system, `createTheme`, `ThemeProvider`, per-component `defaultProps`/`variants`), style props, polymorphic `as` + ref forwarding.
- Components: Box, Flex, Stack/HStack/VStack, Grid, Text, Heading, Button, IconButton, Input, Textarea, FormField, Select, Checkbox, Radio/RadioGroup, Switch, Badge, Avatar/AvatarGroup, Card, Spinner, Skeleton, Modal, Menu, Tooltip, Popover, Toast, Tabs, Accordion, Pagination, Table.
- Glass UI by default (`ThemeProvider glass`), four semantic colour sets (glass/solid × light/dark), `Surface` primitive, glass-aware shadows, motion tokens, sliding selection pill for Tabs/Pagination, web transitions, native `blurComponent` hook. Spec in `docs/GLASS.md`.
- Tooling: react-native-builder-bob build, Jest + Testing Library RN tests, Storybook with a Live Code panel, Expo example app.
