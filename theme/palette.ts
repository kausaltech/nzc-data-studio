import { Color } from '@mui/material';
import {
  CommonColors,
  SimplePaletteColorOptions,
  ThemeOptions,
  TypeAction,
  alpha,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    neutral: string;
    dark: string;
  }

  interface PaletteOptions {
    brand: Partial<Color>;
  }

  interface Palette {
    brand: Partial<Color>;
  }
}

export const grey: Partial<Color> = {
  50: '#FDFDFD',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const brand: Partial<Color> = {
  50: '#E3F2F1',
  100: '#C7E6E3',
  200: '#8FC2C1;',
  300: '#7CAEB1;',
  400: '#699AA2;',
  500: '#558692;',
  600: '#437A87;',
  700: '#316D7B;',
  800: '#1F6070;',
  900: '#0D5364;',
};

export const primary: SimplePaletteColorOptions = {
  light: brand[200]!,
  main: brand[500]!,
  dark: brand[800]!,
  contrastText: '#FFFFFF',
};

export const secondary: SimplePaletteColorOptions = {
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  contrastText: '#FFFFFF',
};

export const info: SimplePaletteColorOptions = {
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  contrastText: '#FFFFFF',
};

export const success: SimplePaletteColorOptions = {
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  contrastText: '#FFFFFF',
};

export const warning: SimplePaletteColorOptions = {
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  contrastText: grey[800],
};

export const error: SimplePaletteColorOptions = {
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  contrastText: '#FFFFFF',
};

export const common: Partial<CommonColors> = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action: Partial<TypeAction> = {
  hover: alpha(grey[500]!, 0.08),
  selected: alpha(grey[500]!, 0.16),
  disabled: alpha(grey[500]!, 0.8),
  disabledBackground: alpha(grey[500]!, 0.24),
  focus: alpha(grey[500]!, 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
  active: grey[600],
};

const base: ThemeOptions['palette'] = {
  primary,
  secondary,
  brand,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500]!, 0.2),
  action,
};

export const palette: ThemeOptions['palette'] = {
  ...base,
  mode: 'light',
  text: {
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  },
  background: {
    paper: '#FFFFFF',
    default: grey[100],
    neutral: grey[200],
    dark: brand[900],
  },
};
