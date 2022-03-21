import React, { useCallback, useState } from "react";

import OrderDetail from "../OrderDetail";
import OrdersGrid from "../OrdersGrid";

import type { Breakpoint } from "@mui/material";
import type { MenuItem, Order } from "../../@types";

interface OrdersGridWithDetailProps {
    columns?: { [key in Breakpoint]?: number },
    disableClaim?: boolean,
    disableDelete?: boolean,
    disableDeliver?: boolean,
    menuItems: MenuItem[],
    orders: Order[],
    onEditOrderClick?: (order: Order) => void
}

export default function OrdersGridWithDetail({
    columns,
    menuItems,
    orders,
    onEditOrderClick,
    ...rest
}: OrdersGridWithDetailProps) {
    const [clickedOrder, setClickedOrder] = useState<Order | null>(null);
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

    const onOrderClick = useCallback((order: Order) => {
        setClickedOrder(order);
        setIsOrderDetailOpen(true);
    }, []);

    const onOrderDetailClose = useCallback(() => {
        setIsOrderDetailOpen(false)
    }, []);

    return (
        <>
            <OrdersGrid
                columns={columns}
                menuItems={menuItems}
                orders={orders}
                onClick={onOrderClick}
            />
            <OrderDetail
                open={isOrderDetailOpen}
                onClose={onOrderDetailClose}
                order={clickedOrder}
                onEditOrderClick={onEditOrderClick}
                {...rest}
            />
        </>
    );
}
