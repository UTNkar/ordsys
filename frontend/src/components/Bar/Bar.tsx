import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaUndo } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { Button as MuiButton, IconButton as MuiIconButton } from '@material-ui/core';
import { SnackbarKey, useSnackbar } from 'notistack';
import './Bar.scss';
import AllOrders from './AllOrders';
import CurrentOrder from './CurrentOrder';
import Menu from './Menu';
import OrderNumber from './OrderNumber';
import { DjangoBackend } from '../../api/DjangoBackend';
import { getEventId } from '../../utils/event';
import { CurrentOrderItem, MenuItem, Order, OrderStatus } from '../../@types';

function Bar() {
    const [currentOrder, setCurrentOrder] = useState<CurrentOrderItem[]>([])
    const [mealNote, setMealNote] = useState('')
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [orderNote, setOrderNote] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const [orders, setOrders] = useState<Order[]>([])
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        Promise.all([
            DjangoBackend.get<MenuItem[]>('/api/menu_items/?active=true'),
            DjangoBackend.get<Order[]>(`/api/orders_with_order_items/?event=${getEventId()}&exclude_status=${OrderStatus.DELIVERED}`),
        ])
            .then(([menuItems, orders]) => {
                setMenuItems(menuItems.data)
                setOrders(orders.data)
            })
            .catch(reason => console.log(reason.response))
        return function cleanup() {
            closeSnackbar()
        }
        // We only want this to once so ignore the eslint warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function addToOrderNumber(digit: number) {
        const newNumber = (Number(orderNumber) % 10) * 10 + digit
        setOrderNumber(String(newNumber))
    }

    function clearCurrentOrder() {
        closeSnackbar()
        setCurrentOrder([])
        setMealNote('')
        setOrderNote('')
        setOrderNumber('')
        setOrderToEdit(null)
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
        setOrderNumber(String(order.customer_number))
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

    function modifyOrder(orderId: number, payload: Order | object | undefined = undefined) {
        if (payload !== undefined) {
            DjangoBackend.patch<Order>(`/api/manage_orders_with_order_items/${orderId}/`, payload)
                .then(response => {
                    const index = orders.findIndex(order => order.id === orderId)
                    if (response.data.status === OrderStatus.DELIVERED) {
                        orders.splice(index, 1)
                    } else {
                        orders[index] = response.data
                        if (orderToEdit !== null) {
                            clearCurrentOrder()
                        }
                    }
                    setOrders(orders.slice(0))
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
                    setOrders(orders.filter(order => order.id !== orderId))
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
        const eventId = getEventId()
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
        if (isNaN(eventId) || eventId <= 0) {
            // TODO redirect user to event selector page again
            enqueueSnackbar('Your selected event is invalid!', {
                variant: 'error',
            })
            return
        }
        setIsSubmittingOrder(true)
        if (orderToEdit !== null) {
            const payload = {
                customer_number: orderNumber,
                note: orderNote,
                order_items: orderToEdit.beverages_only ? beverageItems : foodItems
            }
            modifyOrder(orderToEdit.id, payload)
        } else {
            const payloadBase = { event: eventId, customer_number: Number(orderNumber), note: orderNote }
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
                    if (foodResponse !== null && beverageResponse !== null) {
                        setOrders([...orders, foodResponse.data, beverageResponse.data])
                    } else if (foodResponse !== null) {
                        setOrders([...orders, foodResponse.data])
                    } else if (beverageResponse !== null) {
                        setOrders([...orders, beverageResponse.data])
                    }
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

    function removeOrderItem(itemToRemove: CurrentOrderItem) {
        setCurrentOrder(currentOrder.filter(order =>
            order.id !== itemToRemove.id || order.mealNote !== itemToRemove.mealNote
        ))
    }

    function undoOrders([foodOrder, beverageOrder]: [Order | undefined, Order | undefined], snackbarKey: SnackbarKey) {
        Promise.all([
            foodOrder !== undefined ? DjangoBackend.delete(`/api/orders/${foodOrder.id}/`) : null,
            beverageOrder !== undefined ? DjangoBackend.delete(`/api/orders/${beverageOrder.id}/`) : null,
        ]).then(() => {
            if (foodOrder !== undefined && beverageOrder !== undefined) {
                setOrders(orders.filter(order => order.id !== foodOrder.id || order.id !== beverageOrder.id))
            } else if (foodOrder !== undefined) {
                setOrders(orders.filter(order => order.id !== foodOrder.id))
            } else if (beverageOrder !== undefined) {
                setOrders(orders.filter(order => order.id !== beverageOrder.id))
            }
        }).catch(() => {
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

    return (
        <Container fluid className="flex-grow-1">
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
                                    removeOrderItem={removeOrderItem}
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
                                    orderIsValid={currentOrder.length > 0 && orderNumber !== ''}
                                    orderNote={orderNote}
                                    orderNumber={orderNumber}
                                    showSubmitSpinner={isSubmittingOrder}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col id="bar-menu-column">
                    <Menu
                        mealNote={mealNote}
                        menuItems={menuItems}
                        onMealNoteChange={e => setMealNote(e.target.value)}
                        onMenuItemClick={onMenuItemClick}
                    />
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
        </Container>
    );
}

export default Bar
