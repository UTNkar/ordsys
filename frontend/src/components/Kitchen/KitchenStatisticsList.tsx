import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

import type { MenuItem, Order } from '../../@types';

interface KitchenStatisticsListProps {
    menuItems: MenuItem[],
    orders: Order[],
}

export default function KitchenStatisticsList({
    menuItems,
    orders,
}: KitchenStatisticsListProps) {
    const allOrderItems = orders.flatMap((order) => order.order_items);
    const items =
        menuItems
            .filter((menuItem) => menuItem.active)
            .map((menuItem) => ({
                id: menuItem.id,
                name: menuItem.item_name,
                quantity: allOrderItems
                    .filter((orderItem) => orderItem.menu === menuItem.id)
                    .reduce((count, orderItem) => count + orderItem.quantity, 0)
            }))
            .filter(({ quantity }) => quantity > 0);

    return (
        <List dense sx={{ paddingLeft: 1.5 }}>
            {items.map(({ id, name, quantity }) => (
                <ListItem key={id} disablePadding>
                    <ListItemText disableTypography>
                        <Typography component="p" variant="h6">
                            {`${quantity}x ${name}`}
                        </Typography>
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    )
}
