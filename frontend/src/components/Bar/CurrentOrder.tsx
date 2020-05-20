import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import { MdClose } from 'react-icons/md';
import './CurrentOrder.scss';
import { CurrentOrderItem } from '../../@types';

interface CurrentOrderProps {
    currentOrder: CurrentOrderItem[]
    removeOrderItem: (item: CurrentOrderItem) => void
}

function CurrentOrder({ currentOrder, removeOrderItem }: CurrentOrderProps) {
    return (
        <Container className='current-order-container'>
            {currentOrder.map(item =>
                <Row xs={2} key={item.id + item.mealNote}>
                    <Col xs={2} className='pr-0'>
                        <IconButton size='medium' onClick={ () => removeOrderItem(item) }>
                            <MdClose />
                        </IconButton>
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
