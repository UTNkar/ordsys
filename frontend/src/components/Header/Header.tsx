import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import './Header.scss';

function Header() {
    const [date, setDate] = useState(new Date().toLocaleString('sv-SE'))

    useEffect(() => {
        const intervalId = window.setInterval(() => setDate(new Date().toLocaleString('sv-SE')), 1000)
        return function cleanup() {
            window.clearInterval(intervalId)
        }
    }, [])

    return (
        <Navbar className="header" expand="lg">
            <Link to="/">
                <Navbar.Brand>Organisation</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Item>{date}</Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
