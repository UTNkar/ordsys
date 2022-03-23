import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    OutlinedInput,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import { FaUndo } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

import { useMenuItems, useOrdersWithItems, useSnackbar } from '../../hooks';
import {
    useCreateOrderMutation,
    useDeleteOrderMutation,
    useUpdateOrderContentsMutation,
} from "../../api/backend";
import CurrentOrder from './CurrentOrder';
import MembershipChecker from './MembershipChecker';
import Menu from './Menu';
import Numpad from './Numpad';
import OrdersGridWithDetail from "../OrdersGridWithDetail";

import { BarRenderMode, OrderStatus } from '../../@types';
import type { SnackbarKey } from 'notistack';
import type { CurrentOrderItem, MenuItem, Order } from "../../@types";

interface BarProps {
    renderMode: BarRenderMode
}

const ORDER_GRID_COLUMNS = { xs: 1, xl: 2 };

const Column = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2),
    justifyContent: "space-between",
}));

const SnackbarButton = styled(Button)(() => ({
    color: "inherit",
    fontSize: "1.125rem",
    paddingTop: "3px",
    paddingBottom: "3px",
}));

function Bar({ renderMode }: BarProps) {
    const isFullView = renderMode === BarRenderMode.FULL;
    const [currentOrder, setCurrentOrder] = useState<CurrentOrderItem[]>([])
    const [mealNote, setMealNote] = useState('')
    const [orderNote, setOrderNote] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const { menuItems } = useMenuItems();
    const { orders } = useOrdersWithItems(
        `?exclude_status=${OrderStatus.DELIVERED}`,
        renderMode === BarRenderMode.WAITER,
    );
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();
    const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderContentsMutation();

    const isSubmittingOrder = isCreatingOrder || isDeletingOrder || isUpdatingOrder;

    useEffect(() => closeSnackbar, [closeSnackbar]);

    function addToOrderNumber(digit: number) {
        setOrderNumber(((Number(orderNumber) % 10) * 10 + digit).toString())
    }

    function clearCurrentOrder() {
        closeSnackbar()
        setCurrentOrder([])
        setMealNote('')
        setOrderNote('')
        setOrderNumber('')
        setOrderToEdit(null)
    }

    function decrementItemQuantity(item: CurrentOrderItem) {
        if (item.quantity === 1) {
            setCurrentOrder(currentOrder.filter(order =>
                order.id !== item.id || order.mealNote !== item.mealNote
            ))
        } else {
            const index = currentOrder.indexOf(item)
            currentOrder[index].quantity -= 1
            setCurrentOrder(currentOrder.slice(0))
        }
    }

    function incrementItemQuantity(item: CurrentOrderItem) {
        const index = currentOrder.indexOf(item)
        currentOrder[index].quantity += 1
        setCurrentOrder(currentOrder.slice(0))
    }

    function editOrder(order: Order) {
        const orderToEdit = order.order_items.map(orderItem => {
            // TODO ensure menuItem is not undefined.
            //  It shouldn't be unless menu items are removed during the event and they are re-fetched
            //  or real-time updates are in place
            const menuItem = menuItems.find(item => item.id === orderItem.menu) as MenuItem
            return {
                id: orderItem.menu,
                item_name: menuItem.item_name,
                active: menuItem.active,
                beverage: menuItem.beverage,
                org: menuItem.org,
                quantity: orderItem.quantity,
                mealNote: orderItem.special_requests,
            }
        })
        setCurrentOrder(orderToEdit)
        setOrderNote(order.note)
        setOrderNumber(order.customer_number)
        setOrderToEdit(order)
        enqueueSnackbar('You are editing an order', {
            action: (
                <SnackbarButton onClick={() => clearCurrentOrder()}>
                    Cancel
                </SnackbarButton>
            ),
            anchorOrigin: {
                horizontal: 'center', vertical: 'top'
            },
            persist: true,
            preventDuplicate: true,
            variant: 'warning',
        })
    }

    function modifyOrder(orderId: number, payload: Order | object | undefined = undefined) {
        if (payload !== undefined) {
            updateOrder({ orderId, body: payload })
                .unwrap()
                .then(() => {
                    clearCurrentOrder()
                    enqueueSnackbar('Order successfully updated!', {
                        autoHideDuration: 2500,
                        variant: 'success',
                    })
                })
                .catch(() => enqueueSnackbar('Order update failed!', { variant: 'error' }));
        } else {
            deleteOrder(orderId)
                .unwrap()
                .then(() => enqueueSnackbar('Order successfully deleted!', {
                    autoHideDuration: 2500,
                    variant: 'success',
                }))
                .catch(() => enqueueSnackbar('Order deletion failed!', { variant: 'error' }));
        }
    }

    function onMenuItemClick(clickedItem: MenuItem) {
        if (orderToEdit !== null && orderToEdit.beverages_only !== clickedItem.beverage) {
            enqueueSnackbar("Can't add non-beverage to a beverage order (or vice versa)!", {
                variant: 'error',
            })
            return
        }
        const existingItemIndex = currentOrder.findIndex(existingItem =>
            existingItem.id === clickedItem.id && existingItem.mealNote === mealNote
        )
        if (existingItemIndex === -1) {
            const itemToAdd = { ...clickedItem, mealNote, quantity: 1 } as CurrentOrderItem
            setCurrentOrder([...currentOrder, itemToAdd])
            setMealNote('')
        } else {
            currentOrder[existingItemIndex].quantity += 1
            setCurrentOrder(currentOrder.slice(0))
            setMealNote('')
        }
    }

    function onSubmitOrder(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const foodItems =
            currentOrder
                .filter(item => !item.beverage)
                .map(item => {
                    return { menu: item.id, quantity: item.quantity, special_requests: item.mealNote }
                })
        const beverageItems =
            currentOrder
                .filter(item => item.beverage)
                .map(item => {
                    return { menu: item.id, quantity: item.quantity, special_requests: item.mealNote }
                })
        if (orderToEdit !== null) {
            const payload = {
                customer_number: orderNumber,
                note: orderNote,
                order_items: orderToEdit.beverages_only ? beverageItems : foodItems
            }
            modifyOrder(orderToEdit.id, payload)
        } else {
            const payload = [
                {
                    customer_number: orderNumber,
                    note: orderNote,
                    beverages_only: false,
                    order_items: foodItems,
                },
                {
                    customer_number: orderNumber,
                    note: orderNote,
                    beverages_only: true,
                    order_items: beverageItems,
                },
            ].filter((item) => item.order_items.length > 0);
            createOrder(payload)
                .unwrap()
                .then((orders) => {
                    clearCurrentOrder()
                    enqueueSnackbar('Order created!', {
                        action: key =>
                            <SnackbarButton onClick={() => undoOrders(orders, key)}>
                                Undo
                            </SnackbarButton>,
                        variant: 'success',
                    })
                })
                .catch(() => enqueueSnackbar('Could not create order', { variant: 'error' }));
        }
    }

    /**
     * Validates if the currently queued order meets the follow criteria:
     * - Order number must be larger than 10
     * - Order number must have have a remainder larger than 0 modulo 10.
     * <br>
     * These must be true as the string version is represented as 'NN - X' where 'X' is the 10's of the number.
     * '00 - X' is not valid (excluding '00 - 0'), and neither is 'NN - 0'.
     * The special order number '00 - 0' is allowed as it's internally used for food to employees.
     */
    function validateCurrentOrder() {
        return currentOrder.length > 0 && orderNumber !== ''
    }

    function undoOrders(orders: Order[], snackbarKey: SnackbarKey) {
        Promise.all(orders.map(({ id }) => deleteOrder(id).unwrap()))
            .catch(() => {
                enqueueSnackbar('Failed to undo order!', {
                    action: key =>
                        <>
                            <SnackbarButton onClick={() => undoOrders(orders, key)}>
                                Retry
                            </SnackbarButton>
                            <IconButton
                                aria-label='Close'
                                color='inherit'
                                onClick={() => closeSnackbar(key)}
                            >
                                <MdClose />
                            </IconButton>
                        </>,
                    persist: true,
                    variant: 'error',
                })
            })
        closeSnackbar(snackbarKey)
    }

    const flex = `1 1 ${isFullView ? "33.33" : "50"}%`;

    const ordersGrid = (
        <OrdersGridWithDetail
            columns={ORDER_GRID_COLUMNS}
            disableClaim
            menuItems={menuItems}
            orders={orders}
            onEditOrderClick={editOrder}
        />
    );

    return (
        <Stack direction="row" height="100%" width="100%">
            <Column flex={flex}>
                <Box flexGrow={1} overflow="auto">
                    <Box textAlign="center" marginBottom={1}>
                        <Typography
                            align="center"
                            component="h2"
                            display="inline-block"
                            fontWeight="bold"
                            marginRight={0.5}
                            variant="h4"
                        >
                            Current order
                        </Typography>
                        <IconButton
                            aria-label="Clear order"
                            color="error"
                            disabled={currentOrder.length === 0}
                            onClick={clearCurrentOrder}
                            sx={{ verticalAlign: "bottom" }}
                        >
                            <FaUndo />
                        </IconButton>
                    </Box>
                    <Box
                        flex="1 0 0"
                        component={CurrentOrder}
                        currentOrder={currentOrder}
                        decrementItemQuantity={decrementItemQuantity}
                        incrementItemQuantity={incrementItemQuantity}
                    />
                </Box>
                <Numpad
                    addToOrderNumber={addToOrderNumber}
                    clearOrderNumber={() => setOrderNumber('')}
                    onSubmitOrder={onSubmitOrder}
                    onOrderNoteChange={e => setOrderNote(e.target.value)}
                    orderIsValid={validateCurrentOrder()}
                    orderNote={orderNote}
                    orderNumber={orderNumber}
                    showSubmitSpinner={isSubmittingOrder}
                />
            </Column>
            <Column flex={flex}>
                <Box marginBottom={2}>
                    <Typography
                        align="center"
                        component="h2"
                        fontWeight="bold"
                        marginBottom={1}
                        variant="h4"
                    >
                        Menu
                    </Typography>
                    <OutlinedInput
                        aria-label="Item modification"
                        label="Item modification"
                        notched={false}
                        placeholder="Item modification"
                        value={mealNote}
                        onChange={(e) => setMealNote(e.target.value)}
                        size="small"
                        sx={{
                            width: "100%",
                            fontSize: "1.35rem",
                            marginBottom: 2,
                            "& > input": { textAlign: "center" },
                        }}
                    />
                    <Menu onMenuItemClick={onMenuItemClick} />
                </Box>
                {isFullView
                    ? <MembershipChecker/>
                    : ordersGrid
                }
            </Column>
            {isFullView && (
                <Column flex={flex} sx={{ justifyContent: "flex-start" }}>
                    <Typography
                        align="center"
                        component="h2"
                        fontWeight="bold"
                        marginBottom={3}
                        variant="h4"
                    >
                        All orders
                    </Typography>
                    {ordersGrid}
                </Column>
            )}
        </Stack>
    );
}

export default Bar
