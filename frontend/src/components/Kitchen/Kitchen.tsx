import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './Kitchen.scss';
import OrderTicket from '../Order/OrderTicket';

function Kitchen() {
    const foods = ['2 Main', '1 Veg', '3 Vegan', '1 Pizza']

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
                    {foods.map((value, index) =>
                        <OrderTicket
                            createdTimestamp="10:00"
                            note="Gluten free"
                            orderItems={foods}
                            orderNumber={index}
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
                    {foods.map((value, index) =>
                        <OrderTicket
                            createdTimestamp="10:00"
                            note="Gluten free"
                            orderItems={foods}
                            orderNumber={index}
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
                            {foods.map((value, index) =>
                                <OrderTicket
                                    createdTimestamp="10:00"
                                    note="Gluten free"
                                    orderItems={foods}
                                    orderNumber={index}
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
