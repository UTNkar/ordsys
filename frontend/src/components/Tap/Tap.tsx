import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import '../Kitchen/Kitchen.scss';
import OrderTicket from '../Order/OrderTicket';
import { DjangoBackend } from '../../api/DjangoBackend';
import { getEventId } from '../../utils/event';
import { MenuItem, Order, OrderStatus } from '../../@types';

function changeOrderStatus(order: Order, newStatus: OrderStatus) {
    DjangoBackend.patch(`/api/orders/${order.id}/`, { status: newStatus })
        .catch(reason => console.log(reason))
}

function Tap() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        function getOrders() {
            DjangoBackend.get<Order[]>(
                `/api/orders_with_order_items/?event=${getEventId()}&beverages_only=true&exclude_status=${OrderStatus.DELIVERED}`
            )
                .then(response => setOrders(response.data))
                .catch(reason => console.log(reason.response))
        }
        DjangoBackend.get<MenuItem[]>('/api/menu_items/?active=true&beverage=true')
            .then(response => setMenuItems(response.data))
            .catch(reason => console.log(reason.response))
        const intervalId = setInterval(() => getOrders(), 1000)
        return function cleanup() {
            clearInterval(intervalId)
        }
    }, [])

    const ordersWaiting    = orders.filter(order => order.status === OrderStatus.WAITING)
    const ordersDone       = orders.filter(order => order.status === OrderStatus.DONE)

    return (
        <Container fluid className="flex-grow-1">
            <Row id="top-row" className="text-center">
                <Col>
                    <h2 className="py-3">Waiting</h2>
                </Col>
                <Col>
                    <h2 className="py-3">Done</h2>
                </Col>
            </Row>
            <Row id="content-row" className="justify-content-center">
                <Col className="border-right order-column">
                    {ordersWaiting.map(order =>
                        <OrderTicket
                            key={order.id}
                            buttons={
                                <Button
                                    className="shadow-sm"
                                    variant="outline-secondary"
                                    onClick={() => changeOrderStatus(order, OrderStatus.DONE)}
                                >
                                    <img
                                        src={'/assets/images/arrow_right.svg'}
                                        alt="Mark order as done."
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
                <Col>
                    <Row>
                        <Col className="order-column">
                            {ordersDone.map(order =>
                                <OrderTicket
                                    key={order.id}
                                    buttons={
                                        <Button
                                            className="shadow-sm"
                                            variant="outline-secondary"
                                            onClick={() => changeOrderStatus(order, OrderStatus.WAITING)}
                                        >
                                            <img
                                                src={'/assets/images/arrow_left.svg'}
                                                alt="Mark order as waiting."
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
                </Col>
            </Row>
        </Container>
    );
}

export default Tap
