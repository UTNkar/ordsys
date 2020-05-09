import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaUndo } from 'react-icons/fa';
import { Button as MuiButton } from '@material-ui/core';
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

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        Promise.all([
            DjangoBackend.get<MenuItem[]>('/api/menu_items/?active=true'),
            DjangoBackend.get<Order[]>(`/api/orders_with_order_items/?exclude_status=${OrderStatus.DELIVERED}`),
        ])
            .then(([menuItems, orders]) => {
                setMenuItems(menuItems.data)
                setOrders(orders.data)
            })
            .catch(reason => console.log(reason.response))
    }, [])

    function addToOrderNumber(digit: number) {
        const newNumber = (Number(orderNumber) % 10) * 10 + digit
        setOrderNumber(String(newNumber))
    }

    function clearCurrentOrder() {
        setCurrentOrder([])
        setMealNote('')
        setOrderNote('')
        setOrderNumber('')
    }

    function modifyOrder(orderId: number, payload: Order | object | undefined = undefined) {
        const index = orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
            if (payload === undefined || ('status' in payload && payload.status === OrderStatus.DELIVERED)) {
                orders.splice(index, 1)
            } else {
                orders[index] = { ...orders[index], ...payload }
            }
            setOrders(orders.slice(0))
        }
    }

    function onMenuItemClick(clickedItem: MenuItem) {
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
        const orderItems = currentOrder.map(item => {
            return { menu: item.id, quantity: item.quantity, special_requests: item.mealNote }
        })
        if (isNaN(eventId) || eventId <= 0) {
            // TODO redirect user to event selector page again
            enqueueSnackbar('Your selected event is invalid!', {
                variant: 'error',
            })
        } else {
            const payload = {
                event: eventId,
                customer_number: Number(orderNumber),
                note: orderNote,
                order_items: orderItems
            }
            DjangoBackend.post<Order>('/api/manage_orders_with_order_items/', payload)
                .then(response => {
                    setOrders([...orders, response.data])
                    clearCurrentOrder()
                    enqueueSnackbar('Order created!', {
                        action: key => <MuiButton onClick={ () => undoOrder(response.data, key) }>Undo</MuiButton>,
                        variant: 'success',
                    })
                })
                .catch(() => enqueueSnackbar('Could not create order', {
                    variant: 'error',
                }))
        }
    }

    function undoOrder(orderToUndo: Order, snackbarKey: SnackbarKey) {
        DjangoBackend.delete(`/api/orders/${orderToUndo.id}/`)
            .catch(reason => console.log(reason.response))
        setOrders(orders.filter(order => order.id !== orderToUndo.id))
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
                                <CurrentOrder currentOrder={currentOrder} />
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
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Bar
