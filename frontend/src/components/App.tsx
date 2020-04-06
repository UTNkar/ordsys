import React from 'react';
import { Route } from 'react-router-dom';
import './App.scss';
import Bar from './Bar/Bar';
import Header from './Header/Header';
import Home from './Home/Home';
import Kitchen from './Kitchen/Kitchen';
import Statistics from './Statistics/Statistics';

function App() {
    return (
        <>
            <Header />
            <Route exact path="/" component={Home} />
            <Route path="/bar" component={Bar} />
            <Route path="/kitchen" component={Kitchen} />
            <Route path="/statistics" component={Statistics} />
        </>
    );
}

export default App
