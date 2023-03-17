import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderLogoutDialog from './HeaderLogoutDialog';
import {
    Alert,
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
}

function Header({ organisation }: HeaderProps) {
    const [date, setDate] = useState(new Date().toLocaleString('sv-SE'))
    const [openLogoutModal, setOpenLogoutModal] = useState(false)
    const dateIntervalId = useRef<number | undefined>(undefined)

    // No point in showing date and time on mobile devices as they already have a clock in the top right corner
    const showDateAndTime = useMediaQuery<Theme>((theme) => theme.breakpoints.up("lg"));

    useEffect(() => {
        if (showDateAndTime) {
            setDate(new Date().toLocaleString('sv-SE'))
            dateIntervalId.current = window.setInterval(() => setDate(new Date().toLocaleString('sv-SE')), 1000)
        } else {
            window.clearInterval(dateIntervalId.current)
        }
    }, [showDateAndTime])

    const onLogoutClick = useCallback(() => {
        console.log("Hello")
    }, []);

    return (
        <AppBar position="static">

            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Tooltip followCursor={true} title="Return to home screen">
                    <Link to="/">
                        <Box sx={{ alignItems: "center", display: "flex" }}>
                            <Box
                                height={{ xs: "2rem", md: "2.5rem" }}
                                component="img"
                                src={THEME_TO_IMAGE[organisation]}
                                alt="Organisation logo"
                            />
                            <IconButton
                                color="iconButtonWhite"
                                size="medium">
                                <HomeIcon fontSize="large" />
                            </IconButton>
                        </Box>
                    </Link>
                </Tooltip>

                <Box
                    sx={{ alignItems: "center", display: "flex" }}
                    id="rightDiv">
                    <Tooltip title="Read the OrdSys documentation">
                        <IconButton
                            color="iconButtonWhite"
                            href="https://docs.utn.se/ordsys/frontend"
                            target="_blank">
                            <HelpIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    {showDateAndTime && (
                        <Typography variant="h4" component="p" paddingBottom={"0.25rem"}>
                            {date}
                        </Typography>
                    )}
                    <Tooltip title="Log out">
                        <IconButton
                            color="iconButtonWhite"
                            onClick={() => setOpenLogoutModal(true)}
                        >
                            <LogoutIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
            <HeaderLogoutDialog openLogoutModal={openLogoutModal} setOpenLogoutModal={setOpenLogoutModal} />
        </AppBar >
    )
}

export default Header
