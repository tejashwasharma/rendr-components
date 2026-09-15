import * as React from 'react';
import { View, ScrollView, Pressable, Image, Text as RNText, Animated, Platform } from 'react-native';
import * as Lib from '../../src';

/** Everything the live editor can reference without imports. */
export const scope: Record<string, unknown> = {
  ...Lib,
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  View,
  ScrollView,
  Pressable,
  Image,
  RNText,
  Animated,
  Platform,
};

export const exportedNames = new Set(Object.keys(Lib));
