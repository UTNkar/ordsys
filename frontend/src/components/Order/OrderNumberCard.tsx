import React, { PropsWithChildren } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './OrderNumberCard.scss'

//OrderNumberCard
//Ticket component used by pickup view

interface OrderNumberCardProps {
    orderNumber: string
    status?: string
}

function OrderNumberCard({
    orderNumber, status
}: PropsWithChildren<OrderNumberCardProps>) {
    return (
        <Card
            className={`p-3 rounded-lg pickupCard pickup-card-status-${status}`}
            // @ts-ignore
            align="center"
        >
            <Row>
                <Col>
                    <Card.Title className={`pickupText text-status-${status}`}># {orderNumber}</Card.Title>
                </Col>
            </Row>
        </Card>
    );
}

export default OrderNumberCard
