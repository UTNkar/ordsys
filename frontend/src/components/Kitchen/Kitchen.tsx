import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './Kitchen.scss';
import OrderTicket from '../Order/OrderTicket';
import { MenuItem, Order, OrderStatus } from '../../@types';

function Kitchen() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        function getOrders() {
            fetch(`http://localhost:8000/api/orders_with_order_items/?exclude_status=${OrderStatus.DELIVERED}`)
                .then(response => response.json())
                .then((orders: Order[]) => setOrders(orders))
                .catch(reason => console.log(reason))
        }
        fetch('http://localhost:8000/api/menu_items/?active=true')
            .then(response => response.json())
            .then((menuItems: MenuItem[]) => setMenuItems(menuItems))
            .catch(reason => console.log(reason))
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
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Kitchen
