import type React from 'react';
import type { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

/** Instance types for refs to RN primitives (RN 0.7x types them as function components). */
export type ViewRef = React.ComponentRef<typeof View>;
export type TextRef = React.ComponentRef<typeof Text>;
export type TextInputRef = React.ComponentRef<typeof TextInput>;
export type PressableRef = React.ComponentRef<typeof Pressable>;
export type ScrollViewRef = React.ComponentRef<typeof ScrollView>;
