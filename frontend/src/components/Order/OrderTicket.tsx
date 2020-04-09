import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './OrderTicket.scss'
import { MenuItem, OrderItem } from '../../@types';

function displayOrderItems(orderItems: OrderItem[] | undefined, menuItems: MenuItem[] | undefined) {
    if (orderItems === undefined || menuItems === undefined) {
        return
    }
    return orderItems.map(orderItem => (
        <ul className="list-unstyled order-ticket-menu-items" key={orderItem.id}>
            <li>
                {`
                    ${orderItem.quantity} 
                    ${menuItems.find(menuItem => menuItem.id === orderItem.menu)?.item_name}
                    ${orderItem.special_requests === "" ? "" : `(${orderItem.special_requests})`}
                `}
            </li>
        </ul>
    ))
}

interface OrderTicketProps {
    createdTimestamp?: string
    menuItems?: MenuItem[]
    note?: string
    orderItems?: OrderItem[]
    orderNumber?: number
    status?: string
}

function OrderTicket({
    createdTimestamp, menuItems, note, orderItems, orderNumber, status
}: OrderTicketProps
) {
    return (
        <Card
            className={`p-3 rounded-lg card-status-${status}`}
            // @ts-ignore
            align="left"
        >
            <Row>
                <Col>
                    <Card.Title># {orderNumber}</Card.Title>
                </Col>
                <Col
                    // @ts-ignore
                    align="right"
                >
                    <Card.Title>{createdTimestamp}</Card.Title>
                </Col>
            </Row>
            <Row>
                <Col>
                    {displayOrderItems(orderItems, menuItems)}
                </Col>
            </Row>
            <Row>
                <Col className="text-info">
                    {note}
                </Col>
            </Row>
        </Card>
    );
}

export default OrderTicket
