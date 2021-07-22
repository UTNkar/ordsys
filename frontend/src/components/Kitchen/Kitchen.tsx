import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useWebSocket, WebSocketPath } from '../../hooks';
import './Kitchen.scss';
import OrderTicket from '../Order/OrderTicket';
import { DjangoBackend } from '../../api/DjangoBackend';
import { onMenuItemsChange, onOrdersChange } from '../../utils/realtimeModelUpdate';
import { DatabaseChangeType, KitchenRenderMode, MenuItem, Order, OrderStatus } from '../../@types';
import { SnackbarKey, useSnackbar } from "notistack";

function showStats(ordersWaiting: Order[], ordersInProgress: Order[], menuItems: MenuItem[]) {
    const orders = [...ordersWaiting, ...ordersInProgress]
    const orderItems = orders.flatMap(order => order.order_items)
    const relevantMenuItems = menuItems.filter(menuItem =>
        orderItems.some(orderItem => orderItem.menu === menuItem.id)
    )
    return relevantMenuItems.map(menuItem =>
        <div className='stats-list-item' key={menuItem.id}>
            {`
                ${orderItems.reduce((accumulator, currentValue) =>
                    accumulator + (currentValue.menu === menuItem.id ? currentValue.quantity : 0), 0
                )} st
                ${menuItem.item_name}
            `}
        </div>
    );
}

function changeOrderStatus(order: Order, newStatus: OrderStatus) {
    DjangoBackend.patch(`/api/orders/${order.id}/`, { status: newStatus })
        .catch(reason => console.log(reason))
}

interface KitchenProps extends RouteComponentProps {
    renderMode: KitchenRenderMode
}

function Kitchen({ renderMode }: KitchenProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [orders, setOrders] = useState<Order[]>([])

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
            sendJsonMessage({ models: ['backend.Order', 'backend.MenuItem'] })
        },
        onMessage: event => {
            const message = JSON.parse(event.data)
            switch (message.model_name) {
                case 'Order':
                    const receivedOrder = message.payload as Order
                    if (renderMode === KitchenRenderMode.BEVERAGES === receivedOrder.beverages_only) {
                        // If we are only rendering beverages, we do not want food orders
                        onOrdersChange(receivedOrder, message.type as DatabaseChangeType, setOrders)
                    }
                    break
                case 'MenuItem':
                    onMenuItemsChange(message.payload as MenuItem, message.type as DatabaseChangeType, setMenuItems)
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
        // We only want this to trigger once per mount so ignore the eslint warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ordersWaiting    = orders.filter(order => order.status === OrderStatus.WAITING)
    const ordersInProgress = orders.filter(order => order.status === OrderStatus.IN_PROGRESS)
    const ordersDone       = orders.filter(order => order.status === OrderStatus.DONE)

    function fetchMenuItemsAndOrders() {
        const getBeveragesOnly = renderMode === KitchenRenderMode.BEVERAGES
        Promise.all([
            DjangoBackend.get<MenuItem[]>('/api/menu_items/?active=true'),
            DjangoBackend.get<Order[]>(
                `/api/orders_with_order_items/?beverages_only=${getBeveragesOnly}&exclude_status=${OrderStatus.DELIVERED}`
            ),
        ])
            .then(([menuItemsResponse, ordersResponse]) => {
                setOrders(ordersResponse.data)
                setMenuItems(menuItemsResponse.data)
            })
            .catch(reason => console.log(reason.response))
    }

    function renderView() {
        return (
            <>
                <Row id="kitchen-top-row">
                    <Col>
                        <h2>Waiting</h2>
                    </Col>
                    <Col>
                        <h2>In Progress</h2>
                    </Col>
                    <Col>
                        <h2>Done</h2>
                    </Col>
                </Row>
                <Row id="kitchen-content-row">
                    <Col className="order-column">
                        {ordersWaiting.map(order =>
                            <OrderTicket
                                key={order.id}
                                buttons={
                                    <Button
                                        className="shadow-sm"
                                        variant="outline-secondary"
                                        onClick={() => changeOrderStatus(order, OrderStatus.IN_PROGRESS)}
                                    >
                                        <img
                                            src={'/assets/images/arrow_right.svg'}
                                            alt="Mark order as in progress"
                                        />
                                    </Button>
                                }
                                createdTimestamp={order.created_timestamp}
                                menuItems={menuItems}
                                note={order.note}
                                orderItems={order.order_items}
                                orderNumber={order.customer_number}
                                status="waiting"
                            />
                        )}
                    </Col>
                    <Col className="order-column">
                        {ordersInProgress.map(order =>
                            <OrderTicket
                                key={order.id}
                                buttons={
                                    <>
                                        <Button
                                            className="shadow-sm"
                                            variant="outline-secondary"
                                            onClick={() => changeOrderStatus(order, OrderStatus.WAITING)}
                                        >
                                            <img
                                                src={'/assets/images/arrow_left.svg'}
                                                alt="Mark order as waiting"
                                            />
                                        </Button>
                                        <Button
                                            className="shadow-sm ml-5"
                                            variant="outline-secondary"
                                            onClick={() => changeOrderStatus(order, OrderStatus.DONE)}
                                        >
                                            <img
                                                src={'/assets/images/arrow_right.svg'}
                                                alt="Mark order as done"
                                            />
                                        </Button>
                                    </>
                                }
                                createdTimestamp={order.created_timestamp}
                                menuItems={menuItems}
                                note={order.note}
                                orderItems={order.order_items}
                                orderNumber={order.customer_number}
                                status="in-progress"
                            />
                        )}
                    </Col>
                    <Col id='done-and-stats-column'>
                        <Row id='done-orders-row'>
                            <Col className="order-column">
                                {ordersDone.map(order =>
                                    <OrderTicket
                                        key={order.id}
                                        buttons={
                                            <Button
                                                className="shadow-sm"
                                                variant="outline-secondary"
                                                onClick={() => changeOrderStatus(order, OrderStatus.IN_PROGRESS)}
                                            >
                                                <img
                                                    src={'/assets/images/arrow_left.svg'}
                                                    alt="Mark order as in progress"
                                                />
                                            </Button>
                                        }
                                        createdTimestamp={order.created_timestamp}
                                        menuItems={menuItems}
                                        note={order.note}
                                        orderItems={order.order_items}
                                        orderNumber={order.customer_number}
                                        status="done"
                                    />
                                )}
                            </Col>
                        </Row>
                        <Row id='stats-row'>
                            <Col id='stats-column'>
                                <h4>
                                    Items waiting and in progress
                                </h4>
                                <div id='stats-list'>
                                    {showStats(ordersWaiting, ordersInProgress, menuItems)}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <Container fluid id="kitchen-container">
            {renderView()}
        </Container>
    );
}

export default Kitchen
