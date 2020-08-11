import React, { useState } from 'react';
import './AllOrders.scss';
import OrderDetail from './OrderDetail';
import OrderTicket from '../Order/OrderTicket';
import { MenuItem, Order, OrderStatus } from '../../@types';

interface AllOrdersProps {
    menuItems: MenuItem[]
    onOrderDelete: (orderId: number) => void
    onOrderDeliver: (orderId: number, newData: Order | object | undefined) => void
    onOrderEdit?: (order: Order) => void
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
                    onOrderDelete(orderId)
                    setShouldShowOrderDetail(false)
                }}
                deliverOrder={orderId => {
                    onOrderDeliver(orderId, { status: OrderStatus.DELIVERED })
                    setShouldShowOrderDetail(false)
                }}
                editOrder={
                    onOrderEdit !== undefined ?
                        order => {
                            onOrderEdit(order)
                            setShouldShowOrderDetail(false)
                        } :
                        undefined
                }
                menuItems={menuItems}
                order={activeOrder}
                show={shouldShownOrderDetail}
            />
        </>
    );
}

export default AllOrders
