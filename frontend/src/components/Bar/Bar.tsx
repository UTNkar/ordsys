import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaUndo } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { Button as MuiButton, IconButton as MuiIconButton } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useMenuItems, useWebSocket, WebSocketPath } from '../../hooks';
import './Bar.scss';
import AllOrders from './AllOrders';
import CurrentOrder from './CurrentOrder';
import Menu from './Menu';
import OrderNumber from './OrderNumber';
import { DjangoBackend } from '../../api/DjangoBackend';
import { orderAscSorter, orderDescSorter } from '../../utils/sorters';
import { onOrdersChange } from '../../utils/realtimeModelUpdate';
import { BarRenderMode, CurrentOrderItem, DatabaseChangeType, MenuItem, Order, OrderStatus } from '../../@types';
import MembershipChecker from '../MembershipChecker/MembershipChecker';

interface BarProps {
    renderMode: BarRenderMode
}

function Bar({ renderMode }: BarProps) {
    const [currentOrder, setCurrentOrder] = useState<CurrentOrderItem[]>([])
    const [mealNote, setMealNote] = useState('')
    const { menuItems } = useMenuItems();
    const [orderNote, setOrderNote] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const [orders, setOrders] = useState<Order[]>([])
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

    const componentIsMounted = useRef(true)
    const networkErrorSnackbarKey = useRef<SnackbarKey | null>(null)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const { sendJsonMessage } = useWebSocket({
        shouldReconnect: () => componentIsMounted.current,
        onOpen: () => {
            const currentNetworkErrorKey = networkErrorSnackbarKey.current
            if (currentNetworkErrorKey !== null) {
                // Re-fetch all data from the database if WebSocket was disconnected
                fetchMenuItemsAndOrders()
                closeSnackbar(currentNetworkErrorKey)
                networkErrorSnackbarKey.current = null
            }
            sendJsonMessage({ models: ['backend.Order'] })
        },
        onMessage: event => {
            const message = JSON.parse(event.data)
            switch (message.model_name) {
                case 'Order':
                    onOrdersChange(message.payload as Order, message.type as DatabaseChangeType, setOrders)
                    if (renderMode === BarRenderMode.WAITER || renderMode === BarRenderMode.HISTORY) {
                        setOrders(prevState => prevState.sort(orderAscSorter))
                    } else {
                        setOrders(prevState => prevState.sort(orderDescSorter))
                    }
                    break
                default:
                    break
            }
        },
        onError: () => {
            if (networkErrorSnackbarKey.current === null) {
                networkErrorSnackbarKey.current = enqueueSnackbar(
                    'Network error, please check your internet connection!',
                    {
                        // Disallow manually closing the Snackbar
                        action: () => {},
                        persist: true,
                        preventDuplicate: true,
                        variant: 'error',
                    }
                )
            }
        },
    }, WebSocketPath.MODEL_CHANGES)

    useEffect(() => {
        fetchMenuItemsAndOrders()
        return function cleanup() {
            componentIsMounted.current = false
            closeSnackbar()
        }
        // We only want this to once so ignore the eslint warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            action: <MuiButton onClick={() => clearCurrentOrder()}>Cancel edit</MuiButton>,
            anchorOrigin: {
                horizontal: 'center', vertical: 'top'
            },
            persist: true,
            preventDuplicate: true,
            variant: 'warning',
        })
    }

    function fetchMenuItemsAndOrders() {
        let orderQuery = `/api/orders_with_order_items/`;
        if (renderMode === BarRenderMode.HISTORY) {
            // For the order history view, we only want last hour's orders
            orderQuery += `?max_hours=1`
        } else {
            orderQuery += `?exclude_status=${OrderStatus.DELIVERED}`
        }
        DjangoBackend.get<Order[]>(orderQuery)
            .then((orders) => {
                if (renderMode === BarRenderMode.WAITER || renderMode === BarRenderMode.HISTORY) {
                    setOrders(orders.data.sort(orderAscSorter))
                } else {
                    setOrders(orders.data.sort(orderDescSorter))
                }
            })
            .catch(reason => console.log(reason.response))
    }

    function modifyOrder(orderId: number, payload: Order | object | undefined = undefined) {
        if (payload !== undefined) {
            DjangoBackend.patch<Order>(`/api/manage_orders_with_order_items/${orderId}/`, payload)
                .then(() => {
                    clearCurrentOrder()
                    enqueueSnackbar('Order successfully updated!', {
                        autoHideDuration: 2500,
                        variant: 'success',
                    })
                })
                .catch(() => enqueueSnackbar('Order update failed!', {
                    variant: 'error',
                }))
                .finally(() => setIsSubmittingOrder(false))
        } else {
            DjangoBackend.delete(`/api/orders/${orderId}/`)
                .then(() => {
                    enqueueSnackbar('Order successfully deleted!', {
                        autoHideDuration: 2500,
                        variant: 'success',
                    })
                })
                .catch(() => {
                    enqueueSnackbar('Order deletion failed!', {
                        variant: 'error',
                    })
                })
                .finally(() => setIsSubmittingOrder(false))
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

    function onSubmitOrder(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
        setIsSubmittingOrder(true)
        if (orderToEdit !== null) {
            const payload = {
                customer_number: orderNumber,
                note: orderNote,
                order_items: orderToEdit.beverages_only ? beverageItems : foodItems
            }
            modifyOrder(orderToEdit.id, payload)
        } else {
            const payloadBase = { customer_number: orderNumber, note: orderNote }
            const foodPromise =
                foodItems.length > 0
                    ? DjangoBackend.post<Order>('/api/manage_orders_with_order_items/', {
                        ...payloadBase,
                        beverages_only: false,
                        order_items: foodItems,
                    })
                    : null
            const beveragePromise =
                beverageItems.length > 0
                    ? DjangoBackend.post<Order>('/api/manage_orders_with_order_items/', {
                        ...payloadBase,
                        beverages_only: true,
                        order_items: beverageItems,
                    })
                    : null
            Promise.all([foodPromise, beveragePromise])
                .then(([foodResponse, beverageResponse]) => {
                    clearCurrentOrder()
                    enqueueSnackbar('Order created!', {
                        action: key =>
                            <MuiButton
                                onClick={() => undoOrders([foodResponse?.data, beverageResponse?.data], key)}
                            >
                                Undo
                            </MuiButton>,
                        variant: 'success',
                    })
                })
                .catch(() => enqueueSnackbar('Could not create order', {
                    variant: 'error',
                }))
                .finally(() => setIsSubmittingOrder(false))
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

    function undoOrders([foodOrder, beverageOrder]: [Order | undefined, Order | undefined], snackbarKey: SnackbarKey) {
        Promise.all([
            foodOrder !== undefined ? DjangoBackend.delete(`/api/orders/${foodOrder.id}/`) : null,
            beverageOrder !== undefined ? DjangoBackend.delete(`/api/orders/${beverageOrder.id}/`) : null,
        ]).catch(() => {
            enqueueSnackbar('Failed to undo order!', {
                action: key =>
                    <>
                        <MuiButton onClick={() => undoOrders([foodOrder, beverageOrder], key)}>Retry</MuiButton>
                        <MuiIconButton
                            aria-label='Close'
                            color='inherit'
                            onClick={() => closeSnackbar(key)}
                            size='medium'
                            title='Close'
                        >
                            <MdClose />
                        </MuiIconButton>
                    </>,
                persist: true,
                variant: 'error',
            })
        })
        closeSnackbar(snackbarKey)
    }

    function renderFullView() {
        return (
            <>
                <Row xs={3} className="bar-top">
                    <Col className="my-2 d-flex flex-row justify-content-center">
                        <h3 className="pr-2 pt-2 align-self-center">Current Order</h3>
                        <Button id="btn-undo" variant="outline-danger" onClick={clearCurrentOrder}>
                            <FaUndo />
                        </Button>
                    </Col>
                    <Col className="my-2 d-flex flex-column justify-content-center">
                        <h3 className="pt-2 align-self-center">Menu</h3>
                    </Col>
                    <Col className="my-2 d-flex flex-column justify-content-center">
                        <h3 className="pt-2 align-self-center">All Orders</h3>
                    </Col>
                </Row>
                <Row xs={3}>
                    <Col id="bar-checkout-column">
                        <Container className="h-100">
                            <Row className="align-items-start h-40">
                                <Col className="h-100 overflow-auto">
                                    <CurrentOrder
                                        currentOrder={currentOrder}
                                        decrementItemQuantity={decrementItemQuantity}
                                        incrementItemQuantity={incrementItemQuantity}
                                    />
                                </Col>
                            </Row>
                            <Row className="align-items-end h-60">
                                <Col>
                                    <OrderNumber
                                        addToOrderNumber={addToOrderNumber}
                                        clearOrderNumber={() => setOrderNumber('')}
                                        onSubmitOrder={onSubmitOrder}
                                        onOrderNoteChange={e => setOrderNote(e.target.value)}
                                        orderIsValid={validateCurrentOrder()}
                                        orderNote={orderNote}
                                        orderNumber={orderNumber}
                                        showSubmitSpinner={isSubmittingOrder}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col id="bar-menu-column">
                        <Container className='h-100 d-flex flex-column'>
                            <input
                                id='meal-note-input'
                                onChange={e => setMealNote(e.target.value)}
                                placeholder="Modification"
                                value={mealNote}
                                type="text"
                            />
                            <Row className="menu align-items-start">
                                <Col>
                                    <Menu onMenuItemClick={onMenuItemClick} />
                                </Col>
                            </Row>
                            <Row className="membership-row align-items-end justify-content-center">
                                <Col className="membership-checker-container">
                                    <MembershipChecker />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col id="bar-all-orders-column">
                        <AllOrders
                            menuItems={menuItems}
                            orders={orders}
                            onOrderDelete={modifyOrder}
                            onOrderDeliver={modifyOrder}
                            onOrderEdit={editOrder}
                        />
                    </Col>
                </Row>
            </>
        )
    }

    function renderDeliveryView() {
        return (
            <>
                <Row className="bar-top">
                    <Col className=" justify-content-center">
                        <h3 className="pt-2 align-self-center">All Orders</h3>
                    </Col>
                </Row>
                <Row>
                    <Col id="bar-all-orders-column">
                        <AllOrders
                            menuItems={menuItems}
                            orders={orders}
                            onOrderDelete={modifyOrder}
                            onOrderDeliver={modifyOrder}
                            onOrderEdit={undefined}
                        />
                    </Col>
                </Row>
            </>
        )
    }

    function renderHistoryView() {
        return (
            <>
                <Row className="bar-top">
                    <Col className=" justify-content-center">
                        <h3 className="pt-2 align-self-center">Order History (last hour)</h3>
                    </Col>
                </Row>
                <Row>
                    <Col id="bar-all-orders-column">
                        <AllOrders
                            clickableOrders={false}
                            menuItems={menuItems}
                            orders={orders}
                            onOrderDelete={modifyOrder}
                            onOrderDeliver={modifyOrder}
                            onOrderEdit={undefined}
                        />
                    </Col>
                </Row>
            </>
        )
    }

    function renderWaiterView() {
        return (
            <>
                <Row xs={2} className="bar-top">
                    <Col className="my-2 d-flex flex-row justify-content-center">
                        <h3 className="pr-2 pt-2 align-self-center">Current Order</h3>
                        <Button id="btn-undo" variant="outline-danger" onClick={clearCurrentOrder}>
                            <FaUndo />
                        </Button>
                    </Col>
                    <Col className="my-2 d-flex flex-column justify-content-center">
                        <h3 className="pt-2 align-self-center">Menu</h3>
                    </Col>
                </Row>
                <Row xs={2}>
                    <Col id="bar-checkout-column">
                        <Container className="h-100">
                            <Row className="align-items-start h-40">
                                <Col className="h-100 overflow-auto">
                                    <CurrentOrder
                                        currentOrder={currentOrder}
                                        decrementItemQuantity={decrementItemQuantity}
                                        incrementItemQuantity={incrementItemQuantity}
                                    />
                                </Col>
                            </Row>
                            <Row className="align-items-end h-60">
                                <Col>
                                    <OrderNumber
                                        addToOrderNumber={addToOrderNumber}
                                        clearOrderNumber={() => setOrderNumber('')}
                                        onSubmitOrder={onSubmitOrder}
                                        onOrderNoteChange={e => setOrderNote(e.target.value)}
                                        orderIsValid={validateCurrentOrder()}
                                        orderNote={orderNote}
                                        orderNumber={orderNumber}
                                        showSubmitSpinner={isSubmittingOrder}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col id="bar-menu-column">
                        <Container className='h-100 d-flex flex-column'>
                            <input
                                id='meal-note-input'
                                onChange={e => setMealNote(e.target.value)}
                                placeholder="Modification"
                                value={mealNote}
                                type="text"
                            />
                            <Col>
                                <Row className="menu align-items-start" id="waiter-menu-column">
                                    <Col>
                                        <Menu onMenuItemClick={onMenuItemClick} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="align-items-end border-bottom" id="waiter-all-orders-column">
                                        <AllOrders
                                            menuItems={menuItems}
                                            orders={orders}
                                            onOrderDelete={modifyOrder}
                                            onOrderDeliver={modifyOrder}
                                            onOrderEdit={editOrder}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Container>
                    </Col>
                </Row>
            </>
        )
    }

    function selectRenderView() {
        switch (renderMode) {
            case (BarRenderMode.FULL):
                return renderFullView()
            case (BarRenderMode.DELIVERY):
                return renderDeliveryView()
            case (BarRenderMode.HISTORY):
                return renderHistoryView()
            case (BarRenderMode.WAITER):
                return renderWaiterView()
        }
    }

    return (
        <Container fluid className="flex-grow-1">
            {selectRenderView()}
        </Container>
    );
}

export default Bar
