import React from 'react';
import { Grid } from "@mui/material";

import PickupOrderNumber from './PickupOrderNumber';

import type { Order } from '../../@types';

interface PickupOrdersProps {
    orders: Order[],
    done: boolean
}

function PickupOrders({ orders, done }: PickupOrdersProps) {
    return (
        <Grid container spacing={2} columns={done ? 2 : 4}>
            {orders.map((order) =>
                <Grid key={order.id} item xs={1}>
                    <PickupOrderNumber
                        orderNumber={order.customer_number}
                        isDone={done}
                    />
                </Grid>
            )}
        </Grid>
    );
}

export default PickupOrders
