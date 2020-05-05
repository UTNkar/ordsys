import React, { useState } from 'react';
import { CardColumns } from 'react-bootstrap';
import './AllOrders.scss';
import OrderDetail from './OrderDetail';
import OrderTicket from '../Order/OrderTicket';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order } from '../../@types';

interface AllOrdersProps {
    menuItems: MenuItem[]
    orders: Order[]
}

function AllOrders({ menuItems, orders }: AllOrdersProps) {
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
