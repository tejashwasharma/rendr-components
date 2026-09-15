import React from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ThemeProvider, type ThemeProviderProps } from './theme';

/** Render inside a `ThemeProvider`. RNTL 14 renders asynchronously, so `await` the result. */
export function renderWithTheme(
  ui: React.ReactElement,
  options: RenderOptions & { themeProps?: ThemeProviderProps } = {},
) {
  const { themeProps, ...rest } = options;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider {...themeProps}>{children}</ThemeProvider>
  );
  return render(ui, { wrapper: Wrapper, ...rest });
}

export * from '@testing-library/react-native';
