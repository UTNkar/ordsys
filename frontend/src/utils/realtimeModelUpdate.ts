import React from 'react';
import { DatabaseChangeType, Order, OrderStatus } from "../@types";

export function onOrdersChange(
    receivedOrder: Order,
    changeType: DatabaseChangeType,
    orderDispatcher: React.Dispatch<React.SetStateAction<Order[]>>,
) {
    switch (changeType) {
        case DatabaseChangeType.CREATE:
            orderDispatcher(prevState => [...prevState, receivedOrder])
            break
        case DatabaseChangeType.UPDATE:
            switch (receivedOrder.status) {
                case OrderStatus.WAITING:
                case OrderStatus.IN_PROGRESS:
                case OrderStatus.DONE:
                case OrderStatus.IN_TRANSIT:
                    orderDispatcher(prevState => {
                        const orderIndex = prevState.findIndex(order => order.id === receivedOrder.id)
                        prevState[orderIndex] = receivedOrder
                        return prevState.slice(0)
                    })
                    break
                case OrderStatus.DELIVERED:
                    orderDispatcher(prevState => prevState.filter(order => order.id !== receivedOrder.id))
                    break
            }
            break
        case DatabaseChangeType.DELETE:
            switch (receivedOrder.status) {
                case OrderStatus.WAITING:
                case OrderStatus.IN_PROGRESS:
                case OrderStatus.DONE:
                case OrderStatus.IN_TRANSIT:
                    orderDispatcher(prevState => prevState.filter(order => order.id !== receivedOrder.id))
                    break
                case OrderStatus.DELIVERED:
                    // Ignore
                    break
            }
            break
    }
}
