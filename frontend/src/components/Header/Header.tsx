import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa'
import { IconButton as MuiIconButton, useMediaQuery } from '@material-ui/core';
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
    const dateIntervalId = useRef<number | undefined>(undefined)

    // No point in showing date and time on mobile devices as they already have a clock in the top right corner
    const showDateAndTime = useMediaQuery('(min-width: 1200px)')
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (showDateAndTime) {
            setDate(new Date().toLocaleString('sv-SE'))
            dateIntervalId.current = window.setInterval(() => setDate(new Date().toLocaleString('sv-SE')), 1000)
        } else {
            window.clearInterval(dateIntervalId.current)
        }
    }, [showDateAndTime])

    function logOut() {
        onLogOutClick()
        enqueueSnackbar('Successfully logged out!', {
            autoHideDuration: 2500,
            variant: 'success',
        })
    }

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
                    {eventName
                        ? <Nav.Item>{eventName}</Nav.Item>
                        : null
                    }
                    {showEditEvent
                        ? <Nav.Item className='nav-item-with-button'>
                            <MuiIconButton onClick={onEditEventClick}>
                                <FaEdit color='#ffffff' />
                            </MuiIconButton>
                        </Nav.Item>
                        : null
                    }
                    {showDateAndTime
                        ? <Nav.Item>{date}</Nav.Item>
                        : null
                    }
                    {showLogOutButton
                        ? <Nav.Item className='nav-item-with-button'>
                            <MuiIconButton onClick={logOut}>
                                <FaSignOutAlt color='#ffffff' />
                            </MuiIconButton>
                        </Nav.Item>
                        : null
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
