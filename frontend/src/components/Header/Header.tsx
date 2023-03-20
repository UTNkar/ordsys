import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderDialog from './HeaderDialog';
import { useSignOutMutation } from "../../api/backend";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import {
    HelpOutline as HelpIcon,
    Home as HomeIcon,
    Logout as LogoutIcon
} from "@mui/icons-material";

import UtnLogo from "../../assets/images/utn.png";
import UtnarmLogo from "../../assets/images/utnarm.png";
import TdLogo from "../../assets/images/td.png";
import KlubbverketLogo from "../../assets/images/klubbverket.png";
import ForsranningenLogo from "../../assets/images/forsranningen.png";
import RebusrallytLogo from "../../assets/images/rebusrallyt.png";

import type { Theme } from "@mui/material";
import { OrganisationTheme } from "../../@types";

const THEME_TO_IMAGE = Object.freeze({
    [OrganisationTheme.UTN]: UtnLogo,
    [OrganisationTheme.UTNARM]: UtnarmLogo,
    [OrganisationTheme.TEKNOLOG_DATAVETARMOTTAGNINGEN]: TdLogo,
    [OrganisationTheme.KLUBBVERKET]: KlubbverketLogo,
    [OrganisationTheme.FORSRANNINGEN]: ForsranningenLogo,
    [OrganisationTheme.REBUSRALLYT]: RebusrallytLogo,
});

interface HeaderProps {
    organisation: OrganisationTheme
    isAuthenticated: Boolean
}

function Header(props: HeaderProps) {
    const [date, setDate] = useState(new Date().toLocaleString('sv-SE'))
    const [openLogoutModal, setOpenLogoutModal] = useState(false)
    const [openHelpModal, setOpenHelpModal] = useState(false)
    const dateIntervalId = useRef<number | undefined>(undefined)
    const [signOut] = useSignOutMutation();

    // No point in showing date and time on mobile devices as they already have a clock in the top right corner
    const showDateAndTime = useMediaQuery<Theme>((theme) => theme.breakpoints.up("lg"));

    const buttonSX = {
        padding: "0.25rem",
        mx: "0.5rem",
        "&:hover": {

            bgcolor: "headerButtons.main",
            color: "headerButtons.contrastText",
        },
    };

    useEffect(() => {
        if (showDateAndTime) {
            setDate(new Date().toLocaleString('sv-SE'))
            dateIntervalId.current = window.setInterval(() => setDate(new Date().toLocaleString('sv-SE')), 1000)
        } else {
            window.clearInterval(dateIntervalId.current)
        }
    }, [showDateAndTime])

    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Tooltip followCursor={true} title="Return to home screen">
                    <Link to="/">
                        <Box sx={{ alignItems: "center", display: "flex" }}>
                            <Box
                                height={{ xs: "2rem", md: "2.5rem" }}
                                component="img"
                                src={THEME_TO_IMAGE[props.organisation]}
                                alt="Organisation logo"
                            />
                            {props.isAuthenticated ?
                                <IconButton
                                    color="headerButtons"
                                    sx={buttonSX}
                                    size="medium"
                                >
                                    <HomeIcon fontSize="large" />
                                </IconButton> : null
                            }
                        </Box>
                    </Link>
                </Tooltip>

                <Box
                    sx={{ alignItems: "center", display: "flex" }}
                    id="rightDiv">
                    <Tooltip title="Open documentation">
                        <IconButton
                            color="headerButtons"
                            onClick={() => setOpenHelpModal(true)}
                            sx={buttonSX}
                        >
                            <HelpIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    {showDateAndTime && (
                        <Typography variant="h4" component="p" paddingBottom={"0.25rem"}>
                            {date}
                        </Typography>
                    )}
                    {props.isAuthenticated ?
                        <Tooltip title="Log out">
                            <IconButton
                                color="headerButtons"
                                onClick={() => setOpenLogoutModal(true)}
                                sx={buttonSX}
                            >
                                <LogoutIcon fontSize="large" />
                            </IconButton>
                        </Tooltip> : null
                    }
                </Box>
            </Toolbar>
            <HeaderDialog
                openLogoutModal={openLogoutModal}
                setOpenLogoutModal={setOpenLogoutModal}
                callback={signOut}
                dialogTitle="Log out?"
                dialogContent=""
            />
            <HeaderDialog
                openLogoutModal={openHelpModal}
                setOpenLogoutModal={setOpenHelpModal}
                callback={() => window.open('https:/docs.utn.se/ordsys/frontend', '_blank')}
                dialogTitle="Read documentation?"
                dialogContent="This will open the OrdSys documentation in a new tab."
            />
        </AppBar >
    )
}

export default Header
