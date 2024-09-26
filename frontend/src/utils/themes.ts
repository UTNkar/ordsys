import {
  createTheme, darken, lighten, responsiveFontSizes,
} from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { OrganisationTheme } from '../@types';

const typography = {
  fontFamily: "'TeXGyreAdventor', sans-serif",
  button: {
    textTransform: 'none',
  },
} as TypographyOptions;

const paletteBase = {
  divider: 'rgba(0, 0, 0, 0.25)',
  error: {
    main: '#d32f2f',
    contrastText: '#fff',
  },
  info: {
    main: '#0f7acb',
    contrastText: '#fff',
  },
  success: {
    main: '#2eab39',
    contrastText: '#fff',
  },
  warning: {
    main: '#f77f00',
    contrastText: '#000',
  },
  waiting: {
    main: '#eaeaea',
    dark: darken('#eaeaea', 0.1 * 1.5),
    light: lighten('#eaeaea', 0.1),
    contrastText: '#000',
  },
  inProgress: {
    main: '#fff3b0',
    dark: darken('#fff3b0', 0.1 * 1.5),
    light: lighten('#fff3b0', 0.1),
    contrastText: '#000',
  },
  inTransit: {
    main: '#dffeff',
    dark: darken('#dffeff', 0.1 * 1.5),
    light: lighten('#dffeff', 0.1),
    contrastText: '#000',
  },
  done: {
    main: '#d0ffb2',
    dark: darken('#d0ffb2', 0.1 * 1.5),
    light: lighten('#d0ffb2', 0.1),
    contrastText: '#000',
  },
  tonalOffset: 0.1,
  contrastThreshold: 4.5,
};

export const themes = {
  [OrganisationTheme.KLUBBVERKET]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#000',
        dark: '#514848',
        light: '#8f8f8f',
        contrastText: '#fff',
      },
    },
  })),
  [OrganisationTheme.UTN]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#004c98',
        dark: '#023b75',
        light: '#207c98',
        contrastText: '#fff',
      },
    },
  })),
  [OrganisationTheme.FORSRANNINGEN]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#c82d30',
        dark: '#aa2528',
        light: '#771f20',
        contrastText: '#fff',
      },
    },
  })),
  [OrganisationTheme.REBUSRALLYT]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#830017',
        dark: '#b31632',
        light: '#d92e4b',
        contrastText: '#fff',
      },
    },
  })),
  [OrganisationTheme.UTNARM]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#008bbd',
        dark: '#016588',
        light: '#03384b',
        contrastText: '#fff',
      },
    },
  })),
  [OrganisationTheme.TEKNOLOG_DATAVETARMOTTAGNINGEN]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#803795',
        dark: '#ad54c6',
        light: '#9d6caa',
        contrastText: '#fff',
      },
    },
  })),
  [OrganisationTheme.MILJOGRUPPEN]: responsiveFontSizes(createTheme({
    typography,
    palette: {
      ...paletteBase,
      primary: {
        main: '#8ac163',
        dark: '#4a8a1d',
        light: '#a2c987',
        contrastText: '#fff',
      },
    },
  })),
};
