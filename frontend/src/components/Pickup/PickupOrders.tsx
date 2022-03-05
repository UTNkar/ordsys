import React from 'react';
import './PickupOrders.scss';
import OrderNumberCard from '../Order/OrderNumberCard';
import { Order, OrderStatus } from '../../@types';

// Component to list orders in the pick up view

interface AllOrdersProps {
    orders: Order[]
    doneCol: Boolean
}

function AllOrders({ orders, doneCol }: AllOrdersProps) {
    if (doneCol) {
        return (
            <>
                <div className="pickup-masonry">
                    {orders.map(order =>
                        (order.status !== OrderStatus.DONE) ? null
                            :
                            <div key={order.id} className="pickup-masonry-brick-done">
                                <OrderNumberCard
                                    key={order.id}
                                    orderNumber={order.customer_number}
                                    status={order.status.toLowerCase().replace(' ', '-')}
                                >
                                    {order.status}
                                </OrderNumberCard>
                            </div>
                    )}
                </div>
            </>
        );
    }
    return (
        <>
            <div className="pickup-masonry">
                {orders.map(order =>
                    (order.status === OrderStatus.DONE) ? null
                        :
                        <div key={order.id} className="pickup-masonry-brick-not-done">
                            <OrderNumberCard
                                key={order.id}
                                orderNumber={order.customer_number}
                                status={order.status.toLowerCase().replace(' ', '-')}
                            >
                                {order.status}
                            </OrderNumberCard>
                        </div>
                )}
            </div>
        </>
    );
}

export default AllOrders
