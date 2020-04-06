import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './OrderTicket.scss'

interface OrderTicketProps {
    createdTimestamp?: string
    note?: string
    orderItems?: string[]
    orderNumber?: number
}

function OrderTicket({ createdTimestamp, note, orderItems, orderNumber }: OrderTicketProps) {
    return (
        <Card
            id="order-ticket"
            className="p-3 rounded-lg"
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
                    <ul id="order-ticket-item-list">
                        {orderItems?.map((orderItem, index) => <li key={index}>{orderItem}</li>)}
                    </ul>
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
