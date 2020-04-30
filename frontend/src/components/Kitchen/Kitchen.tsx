import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import './Kitchen.scss';
import OrderTicket from '../Order/OrderTicket';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order, OrderStatus } from '../../@types';

function showStats(ordersWaiting: Order[], ordersInProgress: Order[], menuItems: MenuItem[]) {
    const orders = [...ordersWaiting, ...ordersInProgress]
    const orderItems = orders.flatMap(order => order.order_items)
    const relevantMenuItems = menuItems.filter(menuItem =>
        orderItems.some(orderItem => orderItem.menu === menuItem.id)
    )
    return relevantMenuItems.map(menuItem =>
        <li key={menuItem.id}>
            {`
                ${orderItems.reduce((accumulator, currentValue) =>
                    accumulator + (currentValue.menu === menuItem.id ? currentValue.quantity : 0), 0
                )}
                ${menuItem.item_name}
            `}
        </li>
    );
}

function changeOrderStatus(order: Order, newStatus: OrderStatus) {
    DjangoBackend.patch(`/api/orders/${order.id}/`, { status: newStatus })
        .catch(reason => console.log(reason))
}

function Kitchen() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        function getOrders() {
            DjangoBackend.get<Order[]>(`/api/orders_with_order_items/?exclude_status=${OrderStatus.DELIVERED}`)
                .then(response => setOrders(response.data))
                .catch(reason => console.log(reason.response))
        }
        DjangoBackend.get<MenuItem[]>('/api/menu_items/?active=true')
            .then(response => setMenuItems(response.data))
            .catch(reason => console.log(reason.response))
        const intervalId = setInterval(() => getOrders(), 1000)
        return function cleanup() {
            clearInterval(intervalId)
        }
    }, [])

    const ordersWaiting    = orders.filter(order => order.status === OrderStatus.WAITING)
    const ordersInProgress = orders.filter(order => order.status === OrderStatus.IN_PROGRESS)
    const ordersDone       = orders.filter(order => order.status === OrderStatus.DONE)

    return (
        <Container fluid className="flex-grow-1">
            <Row className="justify-content-center h-100">
                <Col
                    className="order-column border-right"
                    // @ts-ignore
                    align="center"
                >
                    <h2 className="py-3">
                        Waiting
                    </h2>
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
                            createdTimestamp={order.created_timestamp.slice(11, 16)}
                            menuItems={menuItems}
                            note={order.note}
                            orderItems={order.order_items}
                            orderNumber={order.customer_number}
                            status="waiting"
                        />
                    )}
                </Col>
                <Col
                    className="order-column border-right"
                    // @ts-ignore
                    align="center"
                >
                    <h2 className="py-3">
                        In Progress
                    </h2>
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
                            createdTimestamp={order.created_timestamp.slice(11, 16)}
                            menuItems={menuItems}
                            note={order.note}
                            orderItems={order.order_items}
                            orderNumber={order.customer_number}
                            status="in-progress"
                        />
                    )}
                </Col>
                <Col
                    // @ts-ignore
                    align="center"
                >
                    <Row>
                        <Col id="done-order-column" className="border-bottom">
                            <h2 className="py-3">
                                Done
                            </h2>
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
                                    createdTimestamp={order.created_timestamp.slice(11, 16)}
                                    menuItems={menuItems}
                                    note={order.note}
                                    orderItems={order.order_items}
                                    orderNumber={order.customer_number}
                                    status="done"
                                />
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h4 className="py-3">
                                Total (waiting + in progress)
                            </h4>
                            <Row
                                // @ts-ignore
                                align="left"
                            >
                                <Col>
                                    <ul className="list-unstyled">
                                        {showStats(ordersWaiting, ordersInProgress, menuItems)}
                                    </ul>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Kitchen
