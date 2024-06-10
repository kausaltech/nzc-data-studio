import { ThemeOptions } from '@mui/material';

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

type FontBreakpoints = {
  sm: number;
  md: number;
  lg: number;
};

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
  fontFamily:
    'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 800,
    lineHeight: 80 / 64,
    ...responsiveFontSizes({ sm: 32, md: 40, lg: 48 }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 64 / 48,
    ...responsiveFontSizes({ sm: 29, md: 34, lg: 40 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 33 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    ...responsiveFontSizes({ sm: 23, md: 25, lg: 28 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    ...responsiveFontSizes({ sm: 20, md: 22, lg: 23 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 19 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
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
