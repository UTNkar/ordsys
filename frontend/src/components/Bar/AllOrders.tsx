import React, { useState } from 'react';
import './AllOrders.scss';
import OrderDetail from './OrderDetail';
import OrderTicket from '../Order/OrderTicket';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order, OrderStatus } from '../../@types';

interface AllOrdersProps {
    menuItems: MenuItem[]
    onOrderDelete: (orderId: number) => void
    onOrderDeliver: (orderId: number, newData: Order | object | undefined) => void
    onOrderEdit: (order: Order) => void
    orders: Order[]
}

function AllOrders({ menuItems, onOrderDelete, onOrderDeliver, onOrderEdit, orders }: AllOrdersProps) {
    const [activeOrder, setActiveOrder] = useState<Order | null>(null)
    const [shouldShownOrderDetail, setShouldShowOrderDetail] = useState(false)

    return (
        <>
            <div className="masonry">
                {orders.map(order =>
                    <div key={order.id} className="masonry-brick">
                        <OrderTicket
                            key={order.id}
                            createdTimestamp={order.created_timestamp}
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
                    </div>
                )}
            </div>
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
                editOrder={order => {
                    onOrderEdit(order)
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
