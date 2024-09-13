import { Inter } from 'next/font/google';
import { ThemeOptions } from '@mui/material';

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

type FontBreakpoints = {
  sm: number;
  md: number;
  lg: number;
};

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  adjustFontFallback: false,
  fallback: [
    '-apple-system',
    'system-ui',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});

export function responsiveFontSizes({ sm, md, lg }: FontBreakpoints) {
  return {
    fontSize: pxToRem(sm),
    '@media (min-width:600px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

export const typography: ThemeOptions['typography'] = {
  fontFamily: inter.style.fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    letterSpacing: '-0.6px',
    fontWeight: 700,
    lineHeight: 80 / 64,
    ...responsiveFontSizes({ sm: 32, md: 40, lg: 48 }),
  },
  h2: {
    letterSpacing: '-0.5px',
    fontWeight: 700,
    lineHeight: 64 / 48,
    ...responsiveFontSizes({ sm: 29, md: 34, lg: 40 }),
  },
  h3: {
    letterSpacing: '-0.4px',
    fontWeight: 600,
    lineHeight: 1.5,
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 33 }),
  },
  h4: {
    letterSpacing: '-0.3px',
    fontWeight: 600,
    lineHeight: 1.5,
    ...responsiveFontSizes({ sm: 23, md: 25, lg: 28 }),
  },
  h5: {
    letterSpacing: '-0.25px',
    fontWeight: 600,
    lineHeight: 1.5,
    ...responsiveFontSizes({ sm: 20, md: 22, lg: 23 }),
  },
  h6: {
    letterSpacing: '-0.25px',
    fontWeight: 600,
    lineHeight: 28 / 18,
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 19 }),
  },
  subtitle1: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(16),
  },
  body1: {
    letterSpacing: '-0.1px',
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    letterSpacing: '-0.1px',
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'unset',
  },
};
