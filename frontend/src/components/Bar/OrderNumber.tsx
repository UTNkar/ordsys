import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './OrderNumber.scss';

interface OrderNumberProps {
    addToOrderNumber: (digit: number) => void
    clearOrderNumber: () => void
    onOrderNoteChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    orderNumber: string
    orderNote: string
}

function OrderNumber({
    addToOrderNumber, clearOrderNumber, onOrderNoteChange, orderNumber, orderNote
}: OrderNumberProps) {
    return (
        <Container className="numpad-container">
            <input
                className="mb-2"
                id='numpad-input-top'
                placeholder="Order number"
                readOnly
                value={orderNumber}
            />
            <Row xs={3} className="order-number">
                {/*
                   As react-bootstrap buttons enforce a button variant which we do not want, and TypeScript does not
                   allow setting a custom button variant without annotating with ts-ignore, we use regular HTML buttons
                   with the Bootstrap styles we want.
                 */}
                <Col className="pr-1">
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(1) }>1</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(4) }>4</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(7) }>7</button>
                    <button className="btn btn-block btn-number" onClick={ () => clearOrderNumber() }>C</button>
                </Col>
                <Col className="px-1">
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(2) }>2</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(5) }>5</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(8) }>8</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(0) }>0</button>
                </Col>
                <Col className="pl-1">
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(3) }>3</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(6) }>6</button>
                    <button className="btn btn-block btn-number" onClick={ () => addToOrderNumber(9) }>9</button>
                    <button className="btn btn-block btn-send">S</button>
                </Col>
            </Row>
            <input
                id='numpad-input-bottom'
                onChange={onOrderNoteChange}
                placeholder="Order note"
                type="text"
                value={orderNote}
            />
        </Container>
    );
}

export default OrderNumber
