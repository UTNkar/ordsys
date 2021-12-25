import React, { useRef, useState } from 'react';
import { Route } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { IconButton as MuiIconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import './App.scss';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import Home from './Home/Home';
import Kitchen from './Kitchen/Kitchen';
import Login from './Login/Login';
import Statistics from './Statistics/Statistics';
import { isAuthenticated } from '../utils/authenticationHelper';
import { getAppliedTheme } from '../utils/theme';
import { BarRenderMode, KitchenRenderMode } from '../@types';

const commonSnackbarStyles = {
    '& .MuiSnackbarContent-action': {
        '& .MuiButton-root': {
            '& .MuiButton-label': {
                fontFamily: 'TeXGyreAdventorBold',
                fontSize: '1.2em',
                // Properly centers the action text
                marginBottom: '1px',
            },
            color: 'inherit'
        },
    },
    '& .MuiSnackbarContent-message': {
        fontFamily: 'TeXGyreAdventorRegular',
        fontSize: '1.4em',
        // Properly centers the message text
        marginBottom: '3px',
        '& * .MuiSvgIcon-root': {
            // Properly centers the icon
            marginTop: '2px',
        },
    },
}

const createSnackbarStyles = makeStyles({
    error: { ...commonSnackbarStyles },
    info: { ...commonSnackbarStyles },
    success: { ...commonSnackbarStyles },
    warning: {
        ...commonSnackbarStyles,
        // Use black on orange instead of white on orange for better readability
        color: 'black',
    }
})

function App() {
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(isAuthenticated)

    const snackbarRef = useRef<SnackbarProvider>(null)
    const snackbarClasses = createSnackbarStyles()

    function renderComponents() {
        if (userIsAuthenticated) {
            return (
                <>
                    <Route exact path="/" component={Home} />
                    <Route
                        path="/bar"
                        render={props => <Bar {...props} renderMode={BarRenderMode.FULL} />}
                    />
                    <Route
                        path="/delivery"
                        render={props => <Bar {...props} renderMode={BarRenderMode.DELIVERY} />}
                    />
                    <Route
                        path="/kitchen"
                        render={props => <Kitchen {...props} renderMode={KitchenRenderMode.FOOD} />}
                    />
                    <Route
                        path="/history"
                        render={props => <Bar {...props} renderMode={BarRenderMode.HISTORY} />}
                    />
                    <Route path="/pickup" component={Home} />
                    <Route path="/statistics" component={Statistics} />
                    <Route
                        path="/tap"
                        render={props => <Kitchen {...props} renderMode={KitchenRenderMode.BEVERAGES} />}
                    />
                    <Route
                        path="/waiter"
                        render={props => <Bar {...props} renderMode={BarRenderMode.WAITER} />}
                    />
                </>
            );
        } else {
            return (
                <Login onLogin={() => setUserIsAuthenticated(true)} />
            );
        }
    }

    return (
        <SnackbarProvider
            // Provides a default close button to all Snackbars not overriding 'action' prop
            action={key => (
                <MuiIconButton
                    aria-label='Close'
                    color='inherit'
                    onClick={() => snackbarRef.current?.closeSnackbar(key)}
                    size='medium'
                    title='Close'
                >
                    <MdClose />
                </MuiIconButton>
            )}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            autoHideDuration={5000}
            classes={{
                variantError: snackbarClasses.error,
                variantInfo: snackbarClasses.info,
                variantSuccess: snackbarClasses.success,
                variantWarning: snackbarClasses.warning
            }}
            ref={snackbarRef}
        >
            <Header
                organisationLogo={`/assets/images/${getAppliedTheme() ?? 'utn'}.png`}
            />
            {renderComponents()}
        </SnackbarProvider>
    );
}

export default App
