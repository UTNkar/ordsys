import React from "react";
import { Box, Typography } from "@mui/material";

import PickupOrders from "./PickupOrders";

import type { Order } from "../../@types";

interface PickupColumnProps {
    done: boolean,
    orders: Order[],
}

export default function PickupColumn({
    done,
    orders,
}: PickupColumnProps) {
    return (
        <Box flexBasis={done ? "40%" : "60%"}>
            <Typography
                align="center"
                component={done ? "h1" : "h2"}
                fontWeight="bold"
                marginBottom={5}
                variant="h3"
            >
                {done ? "DONE" : "IN PROGRESS"}
            </Typography>
            <PickupOrders done={done} orders={orders} />
        </Box>
    )
}
