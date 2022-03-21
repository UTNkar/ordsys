import React from "react";
import { Box, Typography } from "@mui/material";

import KitchenStatisticsList from "./KitchenStatisticsList";

import type { MenuItem, Order } from '../../@types';

interface KitchenStatisticsColumnProps {
    menuItems: MenuItem[],
    orders: Order[],
    title: string,
}

export default function KitchenStatisticsColumn({
    title,
    ...rest
}: KitchenStatisticsColumnProps) {
    return (
        <Box display="inline-block" width="50%" sx={{ verticalAlign: "top" }}>
            {rest.orders.length > 0 && (
                <>
                    <Typography fontWeight="bold" component="h3" variant="h5">
                        {title}
                    </Typography>
                    <KitchenStatisticsList {...rest} />
                </>
            )}
        </Box>
    );
}
