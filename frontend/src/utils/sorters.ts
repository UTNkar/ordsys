import { MenuItem, Order, OrderStatus } from "../@types";

export function menuItemSorter(item1: MenuItem, item2: MenuItem) {
    if ((item1.beverage && item2.beverage) || (!item1.beverage && !item2.beverage)) {
        return item1.item_name.localeCompare(item2.item_name, ['sv', 'en'], { sensitivity: 'accent' })
    } else {
        // Quickly convert booleans to numbers; not allowed by TypeScript
        // true & 1 = 1 ; false & 1 = 0
        // @ts-ignore
        return item1.beverage & 1 - item2.beverage & 1
    }
}

export function orderAscSorter(a: Order, b: Order) {
    if (a.status === b.status) {
        return a.id > b.id ? -1 : 1
    } else if (
            a.status === OrderStatus.WAITING
            || b.status === OrderStatus.IN_TRANSIT
            || (b.status === OrderStatus.DONE && a.status === OrderStatus.IN_PROGRESS)
    ) {
        return -1
    } else {
        return 1
    }
}

export function orderDescSorter(a: Order, b: Order) {
    return orderAscSorter(b, a)
}
