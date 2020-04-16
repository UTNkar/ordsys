import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaUndo } from 'react-icons/fa';
import './Bar.scss';

function Bar() {
    return (
        <Container fluid className="flex-grow-1">
            <Row xs={3} className="bar-top">
                <Col className="my-2 d-flex flex-row justify-content-center">
                    <h3 className="pr-2 pt-2 align-self-center">Current Order</h3>
                    <Button id="btn-undo" variant="outline-danger">
                        <FaUndo />
                    </Button>
                </Col>
                <Col className="my-2 d-flex flex-column justify-content-center">
                    <h3 className="pt-2 align-self-center">Menu</h3>
                </Col>
                <Col className="my-2 d-flex flex-column justify-content-center">
                    <h3 className="pt-2 align-self-center">All Orders</h3>
                </Col>
            </Row>
            <Row xs={3}>
                <Col>
                    Current order
                </Col>
                <Col>
                    Menu
                </Col>
                <Col>
                    All orders
                </Col>
            </Row>
        </Container>
    );
}

export default Bar
