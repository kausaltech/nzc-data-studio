'use client';

import { ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material';

import { palette } from './palette';
import { shadows } from './shadows';
import { getOverrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: typeof customShadows;
  }

  interface ThemeOptions {
    customShadows?: typeof customShadows;
  }
}

function getTheme() {
  const base = {
    palette,
    typography,
    shadows,
    customShadows,
    shape: { borderRadius: 8 },
  };

  /**
   * Create a temporary base theme so that any ThemeOptions that depend on a theme
   * (such as `components`) can utilise them during theme creation.
   */
  const baseTheme = createTheme(base);

  const theme = createTheme({
    ...base,
    components: getOverrides(baseTheme),
  });

  return theme;
}

const theme = getTheme();

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
