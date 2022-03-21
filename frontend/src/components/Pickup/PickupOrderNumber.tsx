import React from 'react';
import { Box, Typography } from "@mui/material";

interface PickupOrderNumberProps {
    orderNumber: string
    isDone: boolean
}

function PickupOrderNumber({ orderNumber, isDone }: PickupOrderNumberProps) {
    return (
        <Box
            border={!isDone ? "1px solid #999" : undefined}
            bgcolor={isDone ? "#000" : "transparent"}
            paddingBottom={1}
            paddingX={2}
            borderRadius={1}
            boxShadow={4}
        >
            <Typography
                align="center"
                color={isDone ? "#fff" : undefined}
                component="p"
                variant={isDone ? "h1" : "h2"}
            >
                {`# ${orderNumber}`}
            </Typography>
        </Box>
    );
}

export default PickupOrderNumber
