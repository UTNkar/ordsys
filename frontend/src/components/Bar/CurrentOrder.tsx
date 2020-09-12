import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import { MdAdd as IncrementIcon, MdRemove as DecrementIcon } from 'react-icons/md';
import './CurrentOrder.scss';
import { CurrentOrderItem } from '../../@types';

interface CurrentOrderProps {
    currentOrder: CurrentOrderItem[]
    decrementItemQuantity: (item: CurrentOrderItem) => void
    incrementItemQuantity: (item: CurrentOrderItem) => void
}

function CurrentOrder({ currentOrder, decrementItemQuantity, incrementItemQuantity }: CurrentOrderProps) {
    return (
        <Container className='current-order-container'>
            {currentOrder.map(item =>
                <Row xs={2} key={item.id + item.mealNote} className='align-items-center'>
                    <Col xs={2} className='pr-0'>
                        <Row>
                            <Col>
                                <IconButton size='small' onClick={() => incrementItemQuantity(item)}>
                                    <IncrementIcon />
                                </IconButton>
                                <IconButton size='small' onClick={() => decrementItemQuantity(item)}>
                                    <DecrementIcon />
                                </IconButton>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2} className='px-2'>{item.quantity}</Col>
                    <Col xs={8} className='pl-0'>
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
