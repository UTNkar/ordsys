import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa'
import { IconButton as MuiIconButton, useMediaQuery } from '@material-ui/core';
import './Header.scss';

interface HeaderProps {
    organisationLogo: string
}

function Header({
    organisationLogo
}: HeaderProps) {
    const [date, setDate] = useState(new Date().toLocaleString('sv-SE'))
    const dateIntervalId = useRef<number | undefined>(undefined)

    // No point in showing date and time on mobile devices as they already have a clock in the top right corner
    const showDateAndTime = useMediaQuery('(min-width: 1200px)')

    useEffect(() => {
        if (showDateAndTime) {
            setDate(new Date().toLocaleString('sv-SE'))
            dateIntervalId.current = window.setInterval(() => setDate(new Date().toLocaleString('sv-SE')), 1000)
        } else {
            window.clearInterval(dateIntervalId.current)
        }
    }, [showDateAndTime])

    return (
        <Navbar className="header" expand="sm">
            <Link to="/">
                <Navbar.Brand>
                    <img
                        src={organisationLogo}
                        alt="Organisation logo"
                    />
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="header-nav">
                    {showDateAndTime
                        ? <Nav.Item>{date}</Nav.Item>
                        : null
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
