import React, { PropsWithChildren } from 'react';
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

function getHoursAndMinutes(timestamp: string | undefined) {
    if (timestamp === undefined) {
        return
    }
    function formatTime(time: number) {
        return time >= 10 ? String(time) : '0' + time
    }
    const localisedDate = new Date(Date.parse(timestamp))
    return `${formatTime(localisedDate.getHours())}:${formatTime(localisedDate.getMinutes())}`
}

interface OrderTicketProps {
    buttons?: React.ReactNode
    createdTimestamp?: string
    menuItems?: MenuItem[]
    note?: string
    onClick?: () => void
    orderItems?: OrderItem[]
    orderNumber: string
    status?: string
}

function OrderTicket({
    buttons, children, createdTimestamp, menuItems, note, onClick, orderItems, orderNumber, status
}: PropsWithChildren<OrderTicketProps>) {
    return (
        <Card
            className={`p-3 rounded-lg card-status-${status}`}
            onClick={onClick}
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
                    <Card.Title className="order-ticket-text">
                        {getHoursAndMinutes(createdTimestamp)}
                    </Card.Title>
                </Col>
            </Row>
            <Row>
                <Col>
                    {displayOrderItems(orderItems, menuItems)}
                </Col>
                <Col
                    className="align-self-end"
                    // @ts-ignore
                    align="right"
                >
                    {buttons}
                </Col>
            </Row>
            <Row className="align-items-end">
                <Col className="text-info">
                    {note}
                </Col>
                <Col
                    // @ts-ignore
                    align="right"
                >
                    {children}
                </Col>
            </Row>
        </Card>
    );
}

export default OrderTicket
