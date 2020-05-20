import React from 'react'
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import './OrderDetail.scss';
import OrderTicket from '../Order/OrderTicket';
import { MenuItem, Order } from '../../@types';

interface OrderDetailProps {
    closeOrderDetail: () => void
    deleteOrder: (orderId: number) => void
    deliverOrder: (orderId: number) => void
    editOrder: (order: Order) => void
    menuItems: MenuItem[]
    order: Order | null
    show: boolean
}

function OrderDetail({
    closeOrderDetail, deleteOrder, deliverOrder, editOrder, menuItems, order, show
}: OrderDetailProps) {
    if (order === null) {
        return null
    }
    return (
        <Modal isOpen={ show } className="order-detail-window">
            <div className="order-detail-window-body">
                <div className="close-button" onClick={closeOrderDetail}>+</div>
                <div className="order-detail">
                    <OrderTicket
                        key={order.id}
                        orderNumber={order.customer_number}
                        note={order.note}
                        menuItems={menuItems}
                        orderItems={order.order_items}
                        status={order.status.toLowerCase().replace(' ', '-')}
                    >
                        {order.status}
                    </OrderTicket>
                </div>
                <Button className="btn-success detail-view-button" onClick={() => deliverOrder(order.id)}>
                    Delivered
                </Button>
                <Button className="btn-secondary detail-view-button" onClick={() => editOrder(order)}>
                    Edit
                </Button>
                <Button className="btn-danger detail-view-button" onClick={() => deleteOrder(order.id)}>
                    Delete
                </Button>
            </div>
        </Modal>
    )
}

export default OrderDetail
