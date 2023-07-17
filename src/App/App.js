import React from 'react';
import {
    Provider
} from 'react-redux';
import {
    AppLayout,
} from './Layout';
import {
    createGlobalStyle,
    ThemeProvider
} from 'styled-components'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
    SnackbarProvider
} from 'notistack';
import {
    initStore
} from './Core/State';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    html, body, #root {
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding: 0;
        background-color: ${props => props.theme.backgroundColor};
        color: ${props => props.theme.onBackground};
        font-size: 14px;
        font-family: ${props => props.theme.fontFamily};
        overflow: hidden;
    }

    #root {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-content: flex-start;
    }

    a, a:focus, a:hover, a:active, button, button:focus {
        text-decoration: none;
        outline: none;
        cursor: pointer;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        background-color: ${props => props.theme.backgroundColor} !important;
        -webkit-text-fill-color: ${props => props.theme.onBackground};
    }
`;

const theme = {
    fontFamily: '"Poppins", "Roboto", Helvetica nue, Helvetica, arial, sans-serif',
    primaryColor: '#0082ce',
    primaryDark: '#004771',
    primaryDarker: '#001019',
    onPrimary: '#ffffff',
    backgroundColor: '#ffffff',
    backgroundDark: '#ededed',
    onBackground: '#1a1a1a',
};

export const App = () => {

    const store = initStore();

    return (
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <SnackbarProvider maxSnack={2} autoHideDuration={3000}>
                        <AppLayout />
                    </SnackbarProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </Provider>
    );
};