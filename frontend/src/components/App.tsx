import React, { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { IconButton, StyledEngineProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import './App.scss';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import Home from './Home/Home';
import Kitchen from './Kitchen/Kitchen';
import Login from './Login/Login';
import Pickup from './Pickup/Pickup';
import Statistics from './Statistics/Statistics';
import { isAuthenticated } from '../utils/authenticationHelper';
import { getAppliedTheme } from '../utils/theme';
import { BarRenderMode, KitchenRenderMode } from '../@types';

function App() {
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(isAuthenticated)

    const snackbarRef = useRef<SnackbarProvider>(null)

    function renderComponents() {
        if (userIsAuthenticated) {
            return (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/bar"
                        element={<Bar renderMode={BarRenderMode.FULL} />}
                    />
                    <Route
                        path="/delivery"
                        element={<Bar renderMode={BarRenderMode.DELIVERY} />}
                    />
                    <Route
                        path="/kitchen"
                        element={<Kitchen renderMode={KitchenRenderMode.FOOD} />}
                    />
                    <Route
                        path="/history"
                        element={<Bar renderMode={BarRenderMode.HISTORY} />}
                    />
                    <Route path="/pickup" element={<Pickup />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route
                        path="/tap"
                        element={<Kitchen renderMode={KitchenRenderMode.BEVERAGES} />}
                    />
                    <Route
                        path="/waiter"
                        element={<Bar renderMode={BarRenderMode.WAITER} />}
                    />
                </Routes>
            );
        } else {
            return (
                <Login onLogin={() => setUserIsAuthenticated(true)} />
            );
        }
    }

    return (
        <StyledEngineProvider injectFirst>
            <SnackbarProvider
                // Provides a default close button to all Snackbars not overriding 'action' prop
                action={key => (
                    <IconButton
                        aria-label='Close'
                        color='inherit'
                        onClick={() => snackbarRef.current?.closeSnackbar(key)}
                        size='medium'
                        title='Close'
                    >
                        <MdClose />
                    </IconButton>
                )}
                maxSnack={4}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                autoHideDuration={5000}
                classes={{
                    variantError: "base-snackbar",
                    variantInfo: "base-snackbar",
                    variantSuccess: "base-snackbar",
                    variantWarning: "base-snackbar warning-snackbar",
                }}
                ref={snackbarRef}
            >
                <Header
                    organisationLogo={`/assets/images/${getAppliedTheme() ?? 'utn'}.png`}
                />
                {renderComponents()}
            </SnackbarProvider>
        </StyledEngineProvider>
    );
}

export default App
