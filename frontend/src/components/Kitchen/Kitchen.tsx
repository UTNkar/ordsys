import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useMenuItems, useOrdersWithItems } from '../../hooks';
import './Kitchen.scss';
import OrderTicket from '../OrderTicket';
import { KitchenRenderMode, MenuItem, Order, OrderStatus } from '../../@types';

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

    const beveragesOnly = renderMode === KitchenRenderMode.BEVERAGES;
    const orders = allOrders.filter((order) => order.beverages_only === beveragesOnly);
    const ordersWaiting    = orders.filter(order => order.status === OrderStatus.WAITING)
    const ordersInProgress = orders.filter(order => order.status === OrderStatus.IN_PROGRESS)
    const ordersDone       = orders.filter(order => order.status === OrderStatus.DONE)

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
                                buttons
                                component="div"
                                disableStatus
                                fullHeight={false}
                                menuItems={menuItems}
                                order={order}
                            />
                        )}
                    </Col>
                    <Col className="order-column">
                        {ordersInProgress.map(order =>
                            <OrderTicket
                                key={order.id}
                                buttons
                                component="div"
                                disableStatus
                                fullHeight={false}
                                menuItems={menuItems}
                                order={order}
                            />
                        )}
                    </Col>
                    <Col id='done-and-stats-column'>
                        <Row id='done-orders-row'>
                            <Col className="order-column">
                                {ordersDone.map(order =>
                                    <OrderTicket
                                        key={order.id}
                                        buttons
                                        component="div"
                                        disableStatus
                                        fullHeight={false}
                                        menuItems={menuItems}
                                        order={order}
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
