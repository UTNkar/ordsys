import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

interface HomeButtonProps {
    to: string
    icon: React.ElementType
    label: string
}

function HomeButton({ to, icon, label }: HomeButtonProps) {
    const labelId = `${label.toLowerCase()}-label`;

    return (
        <Button
            draggable="false"
            fullWidth
            variant="outlined"
            component={RouterLink}
            to={to}
            sx={{
                flexDirection: "column",
                "&:hover": {
                    // Override Bootstrap hover CSS
                    color: "primary.main"
                }
            }}
        >
            <Box
                aria-labelledby={labelId}
                color="black"
                component={icon}
                height={60}
                width={60}
            />
            <Typography
                id={labelId}
                align="center"
                component="span"
                variant="h5"
            >
                {label}
            </Typography>
        </Button>
    );
}

export default HomeButton
