import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useOrders } from '../../hooks';
import './Pickup.scss';
import PickupOrders from './PickupOrders';
import { OrderStatus } from "../../@types";

function Pickup() {
    const { orders } = useOrders(`?exclude_status=${OrderStatus.DELIVERED}`, false);

    return (
        <Container className="pickup-main-container">
            <Row xs={2} className="bar-top">
                <Col xs={7} className="my-2 justify-content-center">
                    <h3 className="pr-2 pt-2 align-self-center">IN PROGRESS</h3>
                </Col>
                <Col xs={5} className="my-2 justify-content-center">
                    <h3 className="pt-2 align-self-center">PICKUP</h3>
                </Col>
            </Row>
            <Row xs={2}>
                <Col xs={7}>
                    <Container className="h-100">
                        <PickupOrders
                            orders={orders}
                            doneCol={false}
                        />
                    </Container>
                </Col>
                <Col xs={5}>
                    <Container className='h-100'>
                        <PickupOrders
                            orders={orders}
                            doneCol={true}
                        />
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Pickup
