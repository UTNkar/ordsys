import React from 'react';
import {menuItemSorter} from './sorters';
import { DatabaseChangeType, MenuItem, Order, OrderStatus } from "../@types";

export function onMenuItemsChange(
    receivedMenuItem: MenuItem,
    changeType: DatabaseChangeType,
    menuItemDispatcher: React.Dispatch<React.SetStateAction<MenuItem[]>>,
) {
    switch (changeType) {
        case DatabaseChangeType.CREATE:
            menuItemDispatcher(prevState => [...prevState, receivedMenuItem].sort(menuItemSorter))
            break
        case DatabaseChangeType.UPDATE:
            menuItemDispatcher(prevState => {
                const index = prevState.findIndex(menuItem => menuItem.id === receivedMenuItem.id)
                if (index >= 0) {
                    // An item was either turned inactive or had it's name changed.
                    // Keep the menu item even though it is inactive to keep any orders which are in the pipeline
                    // and still refers to it from breaking. Sort the list in case the name was changed.
                    prevState[index] = receivedMenuItem
                    return prevState.slice(0).sort(menuItemSorter)
                } else if (receivedMenuItem.active) {
                    // A previously inactive item was turned active; add it to the list.
                    return [...prevState, receivedMenuItem].sort(menuItemSorter)
                } else {
                    // An inactive item not in the current state was updated but is still inactive; nothing to do
                    return prevState
                }
            })
            break
        case DatabaseChangeType.DELETE:
            menuItemDispatcher(prevState => prevState.filter(menuItem => menuItem.id !== receivedMenuItem.id))
            break
    }
}

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
