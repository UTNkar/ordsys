import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    useMediaQuery
} from '@mui/material';

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

    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Link to="/">
                    <Box
                        height={{ xs: "2rem", md: "2.5rem" }}
                        component="img"
                        src={THEME_TO_IMAGE[organisation]}
                        alt="Organisation logo"
                    />
                </Link>
                {showDateAndTime && (
                    <Typography variant="h4" component="p">
                        {date}
                    </Typography>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Header
