import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa'
import { IconButton as MuiIconButton } from '@material-ui/core';
import './Header.scss';

interface HeaderProps {
    eventName: string | null
    onEditEventClick: () => void
    organisationLogo: string
    showEditEvent: boolean
}

function Header({ eventName, onEditEventClick, organisationLogo, showEditEvent }: HeaderProps) {
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
                <Navbar.Brand>
                    <img
                        src={organisationLogo}
                        alt="Organisation logo"
                    />
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Item className="ml-3">{eventName}</Nav.Item>
                    {!showEditEvent
                        ? null
                        : <Nav.Item className="ml-2 mr-3">
                            <MuiIconButton className='p-0 pb-1' onClick={onEditEventClick}>
                                <FaEdit color='#ffffff' />
                            </MuiIconButton>
                        </Nav.Item>
                    }
                    <Nav.Item className="mx-3">{date}</Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
