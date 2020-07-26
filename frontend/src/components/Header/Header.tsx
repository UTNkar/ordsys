import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa'
import { IconButton as MuiIconButton } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import './Header.scss';

interface HeaderProps {
    eventName: string | null
    onEditEventClick: () => void
    onLogOutClick: () => void
    organisationLogo: string
    showEditEvent: boolean
    showLogOutButton: boolean
}

function Header({
    eventName, onEditEventClick, onLogOutClick, organisationLogo, showEditEvent, showLogOutButton
}: HeaderProps) {
    const [date, setDate] = useState(new Date().toLocaleString('sv-SE'))
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        const intervalId = window.setInterval(() => setDate(new Date().toLocaleString('sv-SE')), 1000)
        return function cleanup() {
            window.clearInterval(intervalId)
        }
    }, [])

    function logOut() {
        onLogOutClick()
        enqueueSnackbar('Successfully logged out!', {
            autoHideDuration: 2500,
            variant: 'success',
        })
    }

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
                    {!showLogOutButton
                        ? null
                        : <Nav.Item className="mx-1">
                            <MuiIconButton className='p-0 pb-1' onClick={logOut}>
                                <FaSignOutAlt color='#ffffff' />
                            </MuiIconButton>
                        </Nav.Item>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
