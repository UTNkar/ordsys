import React from 'react';
import { Divider, Stack } from "@mui/material";

import { useMenuItems, useOrdersWithItems } from '../../hooks';
import KitchenColumn from "./KitchenColumn";
import KitchenStatisticsColumn from "./KitchenStatisticsColumn";

import { KitchenRenderMode, OrderStatus } from '../../@types';

interface KitchenProps {
    renderMode: KitchenRenderMode
}

function Kitchen({ renderMode }: KitchenProps) {
    const { menuItems } = useMenuItems();
    const { orders: allOrders } = useOrdersWithItems(`?exclude_status=${OrderStatus.DELIVERED}`, false);

    const beveragesOnly = renderMode === KitchenRenderMode.BEVERAGES;
    const orders = allOrders.filter((order) => order.beverages_only === beveragesOnly);
    const ordersWaiting    = orders.filter(order => order.status === OrderStatus.WAITING)
    const ordersInProgress = orders.filter(order => order.status === OrderStatus.IN_PROGRESS)
    const ordersDone       = orders.filter(order => order.status === OrderStatus.DONE)

    return (
        <Stack flexGrow={1} direction="row" spacing={2} padding={2}>
            <KitchenColumn
                menuItems={menuItems}
                orders={ordersWaiting}
                title="Waiting"
            />
            <Divider orientation="vertical" />
            <KitchenColumn
                menuItems={menuItems}
                orders={ordersInProgress}
                title="In progress"
            />
            <Divider orientation="vertical" />
            <KitchenColumn
                menuItems={menuItems}
                orders={ordersDone}
                title="Done"
            >
                <Divider sx={{ marginY: 2 }} />
                <KitchenStatisticsColumn
                    menuItems={menuItems}
                    orders={ordersWaiting}
                    title="Waiting"
                />
                <KitchenStatisticsColumn
                    menuItems={menuItems}
                    orders={ordersInProgress}
                    title="In progress"
                />
            </KitchenColumn>
        </Stack>
    );
}

export default Kitchen
