import React, { useRef, useState } from 'react';
import { Route } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { IconButton as MuiIconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ProviderContext, SnackbarProvider } from 'notistack';
import './App.scss';
import Bar from './Bar/Bar';
import EventSelector from './EventSelector/EventSelector';
import Header from './Header/Header';
import Home from './Home/Home';
import Kitchen from './Kitchen/Kitchen';
import Login from './Login/Login';
import Statistics from './Statistics/Statistics';
import { isAuthenticated } from '../utils/authenticationHelper';
import { getEventName, hasEvent } from '../utils/event';

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
    error:   { ...commonSnackbarStyles },
    info:    { ...commonSnackbarStyles },
    success: { ...commonSnackbarStyles },
    warning: {
        ...commonSnackbarStyles,
        // Use black on orange instead of white on orange for better readability
        color: 'black',
    }
})

function App() {
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(isAuthenticated)
    const [userHasSetEvent, setUserHasSetEvent] = useState(hasEvent)

    const snackbarRef = useRef<ProviderContext>(null)
    const snackbarClasses = createSnackbarStyles()

    function renderComponents() {
        if (userIsAuthenticated && userHasSetEvent) {
            return (
                <>
                    <Route exact path="/" component={Home} />
                    <Route path="/bar" component={Bar} />
                    <Route path="/kitchen" component={Kitchen} />
                    <Route path="/statistics" component={Statistics} />
                </>
            );
        } else if (userIsAuthenticated) {
            return (
                <EventSelector onEventChosen={() => setUserHasSetEvent(true)} />
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
            action={ key => (
                <MuiIconButton
                    aria-label='Close'
                    color='inherit'
                    onClick={() => snackbarRef.current?.closeSnackbar(key)}
                    size='medium'
                    title='Close'
                >
                    <MdClose />
                </MuiIconButton>
            ) }
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            autoHideDuration={5000}
            classes={{
                variantError:   snackbarClasses.error,
                variantInfo:    snackbarClasses.info,
                variantSuccess: snackbarClasses.success,
                variantWarning: snackbarClasses.warning
            }}
            ref={snackbarRef}
        >
            <Header eventName={getEventName()} />
            {renderComponents()}
        </SnackbarProvider>
    );
}

export default App
