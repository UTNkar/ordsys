import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './CurrentOrder.scss';
import { CurrentOrderItem } from '../../@types';

interface CurrentOrderProps {
    currentOrder: CurrentOrderItem[]
}

function CurrentOrder({ currentOrder }: CurrentOrderProps) {
    return (
        <Container className='current-order-container'>
            {currentOrder.map(item =>
                <Row xs={2} key={item.id + item.mealNote}>
                    <Col xs={2} className='px-2'>{item.quantity}</Col>
                    <Col xs={10} className='pl-0'>
                        {item.item_name}{' '}
                        <span className='meal-note' hidden={item.mealNote === ''}>
                            ({item.mealNote})
                        </span>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default CurrentOrder
