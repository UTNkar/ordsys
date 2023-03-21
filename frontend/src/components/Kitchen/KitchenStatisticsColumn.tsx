import { Box, Typography } from "@mui/material";

import KitchenStatisticsList from "./KitchenStatisticsList";

import type { MenuItem, Order } from '../../@types';

interface KitchenStatisticsColumnProps {
    menuItems: MenuItem[],
    orders: Order[]
}

export default function KitchenStatisticsColumn({
    ...rest
}: KitchenStatisticsColumnProps) {
    return (
        <Box display="inline-block" width="100%" sx={{ verticalAlign: "top" }}>
            {rest.orders.length > 0 && (
                <>
                    <Typography fontWeight="bold" component="h3" variant="h5" gutterBottom>
                        Items waiting and in progress
                    </Typography>
                    <KitchenStatisticsList {...rest} />
                </>
            )}
        </Box>
    );
}
