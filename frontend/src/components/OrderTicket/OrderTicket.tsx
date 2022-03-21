import React from "react";
import {
    Box,
    ButtonBase,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import { useUpdateOrderMutation } from "../../api/backend";

import { OrderStatus } from "../../@types";
import type { MenuItem, Order } from "../../@types";

interface OrderTicketProps {
    buttons?: boolean,
    component?: React.ElementType,
    disableStatus?: boolean,
    fullHeight?: boolean,
    menuItems: MenuItem[],
    order: Order,
    onClick?: () => void,
}

const ORDER_STATUS_TO_COLOR: {[p: string]: string} = Object.freeze({
    [OrderStatus.WAITING]: "waiting",
    [OrderStatus.IN_PROGRESS]: "inProgress",
    [OrderStatus.IN_TRANSIT]: "inTransit",
    [OrderStatus.DONE]: "done",
});

const OrderTicketButton = styled(ButtonBase)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    borderRadius: 8,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2),
    transition: theme.transitions.create(
        "background-color", { duration: theme.transitions.duration.short }
    ),
    width: "100%",
}));

export default function OrderTicket({
    buttons = false,
    component,
    disableStatus = false,
    fullHeight = true,
    menuItems,
    order: {
        id: orderId,
        created_timestamp: createdTimestamp,
        customer_number: orderNumber,
        note: orderNote,
        order_items: orderItems,
        status: orderStatus,
    },
    onClick,
}: OrderTicketProps) {
    const [updateOrder] = useUpdateOrderMutation();

    function changeOrderStatus(status: OrderStatus) {
        updateOrder({ orderId, body: { status } });
    }

    function renderButtons() {
        const isOrderWaiting = orderStatus === OrderStatus.WAITING;
        const isOrderInProgress = orderStatus === OrderStatus.IN_PROGRESS;
        const isOrderDone = orderStatus === OrderStatus.DONE

        const leftButton = (isOrderInProgress || isOrderDone) && (
            <IconButton
                aria-label={`Mark order as ${isOrderDone ? "in progress" : "waiting"}.`}
                color="inherit"
                onClick={() => changeOrderStatus(
                    isOrderDone ? OrderStatus.IN_PROGRESS : OrderStatus.WAITING
                )}
            >
                <MdArrowBack fontSize={48} />
            </IconButton>
        );
        const rightButton = (isOrderWaiting || isOrderInProgress) && (
            <IconButton
                aria-label={`Mark order as ${isOrderWaiting ? "in progress" : "done"}.`}
                color="inherit"
                onClick={() => changeOrderStatus(
                    isOrderWaiting ? OrderStatus.IN_PROGRESS : OrderStatus.DONE
                )}
            >
                <MdArrowForward fontSize={48} />
            </IconButton>
        );

        return (
            <Stack direction="row" alignSelf="center" flexShrink={0} spacing={4}>
                {leftButton}
                {rightButton}
            </Stack>
        )
    }

    const formattedTimestamp =
        new Date(Date.parse(createdTimestamp))
            .toLocaleTimeString("sv-SE")
            .slice(0, -3);

    return (
        <OrderTicketButton
            // @ts-ignore
            component={component}
            focusRipple
            disableRipple={!onClick}
            onClick={onClick}
            role=""
            sx={{
                backgroundColor: `${ORDER_STATUS_TO_COLOR[orderStatus]}.main`,
                "&:hover": onClick && {
                    backgroundColor: `${ORDER_STATUS_TO_COLOR[orderStatus]}.dark`,
                },
                height: fullHeight ? "100%" : undefined,
                // Override Bootstrap CSS
                cursor: !onClick ? "default !important" : undefined,
            }}
        >
            <Stack direction="row">
                <Typography
                    align="left"
                    component="p"
                    variant="h5"
                    fontWeight="bold"
                    flexGrow={1}
                >
                    {`# ${orderNumber}`}
                </Typography>
                {!disableStatus && (
                    <Typography
                        align="center"
                        component="p"
                        variant="h5"
                        flexGrow={1}
                    >
                        {orderStatus}
                    </Typography>
                )}
                <Typography
                    align="right"
                    component="p"
                    variant="h5"
                    flexGrow={1}
                >
                    {formattedTimestamp}
                </Typography>
            </Stack>
            <Divider variant="middle" sx={{ marginY: 1 }} />
            <Stack direction="row" justifyContent="space-between">
                <List dense disablePadding sx={{ flex: "3 2 auto" }}>
                    {orderItems.map(({ id, quantity, menu, special_requests }) => {
                        const menuItem = menuItems.find(({ id }) => id === menu);
                        return (
                            <ListItem key={id}>
                                <ListItemText
                                    disableTypography
                                    primary={(
                                        <Typography
                                            component="p"
                                            variant="h5"
                                        >
                                            {`${quantity}x ${menuItem?.item_name}`}
                                        </Typography>
                                    )}
                                    secondary={special_requests && (
                                        <Typography
                                            component="p"
                                            marginLeft={2}
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            {special_requests}
                                        </Typography>
                                    )}
                                />
                            </ListItem>
                        );
                    })}
                </List>
                {buttons && renderButtons()}
            </Stack>
            {orderNote && (
                <>
                    <Divider variant="middle" sx={{ marginY: 1 }} />
                    <Box component="p" marginBottom={0} textAlign="left">
                        <Typography variant="h5" component="span" fontWeight="bold">
                            Note:
                        </Typography>
                        <Typography variant="h5" component="span">
                            {` ${orderNote}`}
                        </Typography>
                    </Box>
                </>
            )}
        </OrderTicketButton>
    );
}
