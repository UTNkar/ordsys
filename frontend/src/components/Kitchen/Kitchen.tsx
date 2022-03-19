import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useMenuItems, useOrdersWithItems } from '../../hooks';
import './Kitchen.scss';
import OrderTicket from '../Order/OrderTicket';
import { KitchenRenderMode, MenuItem, Order, OrderStatus } from '../../@types';
import { useUpdateOrderMutation } from "../../api/backend";

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

interface KitchenProps {
    renderMode: KitchenRenderMode
}

function Kitchen({ renderMode }: KitchenProps) {
    const { menuItems } = useMenuItems();
    const { orders: allOrders } = useOrdersWithItems(`?exclude_status=${OrderStatus.DELIVERED}`);
    const [updateOrder] = useUpdateOrderMutation();

    const beveragesOnly = renderMode === KitchenRenderMode.BEVERAGES;
    const orders = allOrders.filter((order) => order.beverages_only === beveragesOnly);
    const ordersWaiting    = orders.filter(order => order.status === OrderStatus.WAITING)
    const ordersInProgress = orders.filter(order => order.status === OrderStatus.IN_PROGRESS)
    const ordersDone       = orders.filter(order => order.status === OrderStatus.DONE)

    function changeOrderStatus(order: Order, status: OrderStatus) {
        updateOrder({ orderId: order.id, body: { status } });
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
