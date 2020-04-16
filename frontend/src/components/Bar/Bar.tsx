import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaUndo } from 'react-icons/fa';
import './Bar.scss';
import AllOrders from './AllOrders';
import CurrentOrder from './CurrentOrder';
import Menu from './Menu';
import OrderNumber from './OrderNumber';
import { CurrentOrderItem, MenuItem } from '../../@types';

function Bar() {
    const [currentOrder, setCurrentOrder] = useState<CurrentOrderItem[]>([])
    const [mealNote, setMealNote] = useState('')
    const [orderNote, setOrderNote] = useState('')
    const [orderNumber, setOrderNumber] = useState('')

    function addToOrderNumber(digit: number) {
        const newNumber = (Number(orderNumber) % 10) * 10 + digit
        setOrderNumber(String(newNumber))
    }

    function clearCurrentOrder() {
        setCurrentOrder([])
        setMealNote('')
        setOrderNote('')
        setOrderNumber('')
    }

    function onMenuItemClick(clickedItem: MenuItem) {
        const existingItemIndex = currentOrder.findIndex(existingItem =>
            existingItem.id === clickedItem.id && existingItem.mealNote === mealNote
        )
        if (existingItemIndex === -1) {
            const itemToAdd = { ...clickedItem, mealNote, quantity: 1 } as CurrentOrderItem
            setCurrentOrder([...currentOrder, itemToAdd])
            setMealNote('')
        } else {
            currentOrder[existingItemIndex].quantity += 1
            setCurrentOrder(currentOrder.slice(0))
            setMealNote('')
        }
    }

    return (
        <Container fluid className="flex-grow-1">
            <Row xs={3} className="bar-top">
                <Col className="my-2 d-flex flex-row justify-content-center">
                    <h3 className="pr-2 pt-2 align-self-center">Current Order</h3>
                    <Button id="btn-undo" variant="outline-danger" onClick={clearCurrentOrder}>
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
                <Col id="bar-checkout-column">
                    <Container className="h-100">
                        <Row className="align-items-start h-40">
                            <Col className="h-100 overflow-auto">
                                <CurrentOrder currentOrder={currentOrder} />
                            </Col>
                        </Row>
                        <Row className="align-items-end h-60">
                            <Col>
                                <OrderNumber
                                    addToOrderNumber={addToOrderNumber}
                                    clearOrderNumber={() => setOrderNumber('')}
                                    onOrderNoteChange={e => setOrderNote(e.target.value)}
                                    orderNote={orderNote}
                                    orderNumber={orderNumber}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col id="bar-menu-column">
                    <Menu
                        mealNote={mealNote}
                        onMealNoteChange={e => setMealNote(e.target.value)}
                        onMenuItemClick={onMenuItemClick}
                    />
                </Col>
                <Col id="bar-all-orders-column">
                    <AllOrders />
                </Col>
            </Row>
        </Container>
    );
}

export default Bar
