import React, { useState } from 'react';
import { CardColumns } from 'react-bootstrap';
import './AllOrders.scss';
import OrderDetail from './OrderDetail';
import OrderTicket from '../Order/OrderTicket';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order, OrderStatus } from '../../@types';

interface AllOrdersProps {
    menuItems: MenuItem[]
    onOrderDelete: (orderId: number) => void
    onOrderDeliver: (orderId: number, newData: Order | object | undefined) => void
    orders: Order[]
}

function AllOrders({ menuItems, onOrderDelete, onOrderDeliver, orders }: AllOrdersProps) {
    const [activeOrder, setActiveOrder] = useState<Order | null>(null)
    const [shouldShownOrderDetail, setShouldShowOrderDetail] = useState(false)

    return (
        <>
            <CardColumns className="all-orders-container order-cards">
                {orders.map(order =>
                    <OrderTicket
                        key={order.id}
                        createdTimestamp={order.created_timestamp?.slice(11, 16)}
                        menuItems={menuItems}
                        note={order.note}
                        onClick={() => {
                            setActiveOrder(order)
                            setShouldShowOrderDetail(true)
                        }}
                        orderItems={order.order_items}
                        orderNumber={order.customer_number}
                        status={order.status.toLowerCase().replace(' ', '-')}
                    >
                        {order.status}
                    </OrderTicket>
                )}
            </CardColumns>
            <OrderDetail
                closeOrderDetail={() => setShouldShowOrderDetail(false)}
                deleteOrder={orderId => {
                    DjangoBackend.delete(`/api/orders/${orderId}/`)
                        .catch(reason => console.log(reason.response));
                    onOrderDelete(orderId)
                    setShouldShowOrderDetail(false)
                }}
                deliverOrder={orderId => {
                    const payload = { status: OrderStatus.DELIVERED }
                    DjangoBackend.patch(`/api/orders/${orderId}/`, payload)
                        .catch(reason => console.log(reason.response))
                    onOrderDeliver(orderId, payload)
                    setShouldShowOrderDetail(false)
                }}
                menuItems={menuItems}
                order={activeOrder}
                show={shouldShownOrderDetail}
            />
        </>
    );
}

export default AllOrders
