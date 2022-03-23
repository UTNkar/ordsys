import React, { useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import {
    IconButton,
    Stack,
    StyledEngineProvider,
    ThemeProvider
} from '@mui/material';
import { SnackbarProvider } from 'notistack';
import './App.scss';
import Bar from './Bar';
import Header from './Header';
import Home from './Home';
import Kitchen from './Kitchen';
import Login from './Login';
import Pickup from './Pickup';
import RecentOrders from "./RecentOrders";
import Statistics from './Statistics';
import { BarRenderMode, KitchenRenderMode, OrganisationTheme } from '../@types';
import { useUser } from "../hooks";
import { themes } from "../utils/themes";

function App() {
    const { user, isLoading, isUninitialized } = useUser();
    const isAuthenticated = Boolean(user);

    const snackbarRef = useRef<SnackbarProvider>(null)

    if (isLoading || isUninitialized) {
        return null;
    }

    function renderComponents() {
        if (isAuthenticated) {
            return (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/bar"
                        element={<Bar renderMode={BarRenderMode.FULL} />}
                    />
                    <Route
                        path="/delivery"
                        element={<RecentOrders title="Delivery" />}
                    />
                    <Route
                        path="/kitchen"
                        element={<Kitchen renderMode={KitchenRenderMode.FOOD} />}
                    />
                    <Route
                        path="/history"
                        element={<RecentOrders history title="Orders last hour" />}
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
            return <Login />;
        }
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes[user?.theme || OrganisationTheme.UTN]}>
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
                    <Header organisation={user?.theme || OrganisationTheme.UTN} />
                    <Stack
                        component="main"
                        overflow="auto"
                        sx={(theme) => ({
                                height: "calc(100vh - 56px)",
                                [`${theme.breakpoints.down("sm")} and (orientation: landscape)`]: {
                                    height: "calc(100vh - 48px)",
                                },
                                [`${theme.breakpoints.up("sm")}`]: {
                                    height: "calc(100vh - 64px)",
                                },
                        })}
                    >
                        {renderComponents()}
                    </Stack>
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App
