import { createMuiTheme, Theme, responsiveFontSizes } from '@material-ui/core/styles';
import { ColorPartial } from '@material-ui/core/styles/createPalette';

const APP_MIN_WIDTH = '360px';
const APP_MAX_WIDTH = '1280px';
export interface ThemeProps {
    colors: {
        primary: ColorPartial;
        secondary: ColorPartial;
        tertiary: ColorPartial;
        grey: ColorPartial;
    };
}

export interface customeTheme extends Theme {
    contrastColor: string;
    primary: ColorPartial;
    secondary: ColorPartial;
    tertiary: ColorPartial;
    grey: ColorPartial;
}

const theme = createMuiTheme({});
export const createCustomTheme = (Theme: ThemeProps) => {
    return Object.assign(
        {},
        responsiveFontSizes(
            createMuiTheme({
                breakpoints: {
                    values: {
                        xs: 450,
                        sm: 600,
                        md: 768,
                        lg: 960,
                        xl: 1280,
                    },
                },
                overrides: {
                    MuiCssBaseline: {
                        '@global': {
                            body: {
                                backgroundColor: 'white',
                                margin: 'auto',
                                [theme.breakpoints.down('sm')]: {
                                    minWidth: APP_MIN_WIDTH,
                                    margin: 'auto',
                                },
                            },
                            main: {
                                backgroundColor: 'white',
                                [theme.breakpoints.down('sm')]: {
                                    minWidth: APP_MIN_WIDTH,
                                    margin: 'auto',
                                },
                                [theme.breakpoints.down('xl')]: {
                                    maxWidth: APP_MAX_WIDTH,
                                    margin: 'auto',
                                },
                            },
                        },
                    },
                    MuiButton: {
                        root: {
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            fontSize: '1rem !important',
                            [theme.breakpoints.up('xs')]: {
                                fontSize: '1.12rem  !important',
                            },
                            [theme.breakpoints.up('sm')]: {
                                fontSize: '1.25rem  !important',
                            },
                        },
                        contained: {
                            transitionDuration: '500ms',
                            transitionProperty: 'background-color',
                            '&:hover': {
                                '&.Mui-disabled': {
                                    backgroundColor: Theme.colors.primary[100],
                                },
                            },
                            '&.Mui-disabled': {
                                backgroundColor: Theme.colors.primary[100],
                            },
                        },
                    },
                    MuiToolbar: {
                        root: {
                            width: '100%',
                            [theme.breakpoints.down('xl')]: {
                                maxWidth: APP_MAX_WIDTH,
                                margin: 'auto',
                            },
                        },
                        gutters: {
                            paddingLeft: '8px',
                            paddingRight: '8px',
                        },
                    },
                    MuiInputLabel: {
                        root: {
                            // We had to add !important because in our design even if there is error and input is not focused the label remains grey
                            color: `${Theme.colors.grey[500]} !important`,
                            '&$focused': {
                                color: `${Theme.colors.secondary[500]} !important`,
                                opacity: 0.87,
                                '&.Mui-error': {
                                    color: '#FF1744 !important',
                                },
                            },
                        },
                    },
                    MuiInput: {
                        input: {
                            '&::placeholder': {
                                textTransform: 'none',
                                color: Theme.colors.grey[500],
                            },
                        },
                        formControl: {
                            color: 'rgba(0, 0, 0, 0.87)',
                        },
                    },
                    MuiFilledInput: {
                        root: {
                            borderRadius: '4px',
                            overflow: 'hidden',
                        },
                    },
                    MuiOutlinedInput: {
                        notchedOutline: {
                            borderColor: Theme.colors.secondary[500],
                            borderRadius: '3px',
                        },
                        root: {
                            height: '40px',
                            '&:hover': {
                                borderColor: Theme.colors.secondary[500],
                            },
                        },
                    },
                    MuiTypography: {
                        root: {
                            color: '#000000',
                        },
                    },
                    MuiLink: {
                        root: {
                            cursor: 'pointer',
                        },
                    },
                },
                typography: {
                    fontFamily: ['Open Sans', 'sans-serif'].join(','),
                    h6: {
                        fontSize: '20px',
                    },
                    h5: {
                        fontSize: '24px',
                    },
                    h4: {
                        fontSize: '34px',
                    },
                    h3: {
                        fontSize: '48px',
                    },
                    h2: {
                        fontSize: '60px',
                    },
                    h1: {
                        fontSize: '96px',
                    },
                    subtitle1: {
                        fontSize: '16px',
                    },
                    subtitle2: {
                        fontSize: '14px',
                    },
                    caption: {
                        fontSize: '12px',
                        color: Theme.colors.grey[500],
                        lineHeight: 1,
                    },
                },
                spacing: 4,
                palette: {
                    primary: {
                        main: Theme.colors.primary[500],
                    },
                    secondary: {
                        main: Theme.colors.secondary[500],
                    },
                    grey: Theme.colors.grey,
                    text: {
                        primary: 'rgba(0, 0, 0, 0.87)',
                        secondary: 'rgba(0, 0, 0, 0.54)',
                        disabled: 'rgba(0, 0, 0, 0.38)',
                        hint: 'rgba(0, 0, 0, 0.38)',
                    },
                    error: {
                        main: '#FF1744',
                    },
                    divider: 'rgba(0, 0, 0, 0.12)',
                },
            }),
        ),
        {
            ...Theme.colors,
            contrastColor: '#ffffff',
        },
    );
};
