import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral?: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
  }

  interface PaletteColor {
    lighter?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

export type Theme = MuiTheme;
export type ThemeOptions = MuiThemeOptions;
