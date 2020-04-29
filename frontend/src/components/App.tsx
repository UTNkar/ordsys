import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import './App.scss';
import Bar from './Bar/Bar';
import EventSelector from './EventSelector/EventSelector';
import Header from './Header/Header';
import Home from './Home/Home';
import Kitchen from './Kitchen/Kitchen';
import Login from './Login/Login';
import Statistics from './Statistics/Statistics';
import { isAuthenticated } from '../utils/authenticationHelper';
import { hasEvent } from '../utils/event';

function App() {
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(isAuthenticated)
    const [userHasSetEvent, setUserHasSetEvent] = useState(hasEvent)

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
        <>
            <Header />
            {renderComponents()}
        </>
    );
}

export default App
