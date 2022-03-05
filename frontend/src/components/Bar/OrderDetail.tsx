import React from 'react'
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import './OrderDetail.scss';
import OrderTicket from '../Order/OrderTicket';
import { MenuItem, Order, OrderStatus } from '../../@types';

interface OrderDetailProps {
    claimOrder: (orderId: number) => void
    closeOrderDetail: () => void
    deleteOrder: (orderId: number) => void
    deliverOrder: (orderId: number) => void
    editOrder?: (order: Order) => void
    menuItems: MenuItem[]
    order: Order | null
    show: boolean
}

function OrderDetail({
    claimOrder, closeOrderDetail, deleteOrder, deliverOrder, editOrder, menuItems, order, show
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
                {order.status !== OrderStatus.IN_TRANSIT &&
                    <Button className="btn-info detail-view-button" onClick={() => claimOrder(order.id)}>
                        Mark as claimed
                    </Button>
                }
                <Button className="btn-success detail-view-button" onClick={() => deliverOrder(order.id)}>
                        Mark as delivered
                </Button>
                { editOrder &&
                    <Button className="btn-secondary detail-view-button" onClick={() => editOrder(order)}>
                        Edit order
                    </Button>
                }
                <Button className="btn-danger detail-view-button" onClick={() => deleteOrder(order.id)}>
                    Delete order
                </Button>
            </div>
        </Modal>
    )
}

export default OrderDetail
