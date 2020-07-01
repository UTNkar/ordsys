export interface Event {
    readonly id: number
    readonly name: string
    readonly org: number
}

export interface MenuItem {
    readonly id: number
    readonly item_name: string
    readonly active: boolean
    readonly beverage: boolean
    readonly org: number
}

export interface Order {
    readonly id: number
    customer_number: number
    readonly created_timestamp: string
    delivered_timestamp: string
    note: string
    status: OrderStatus
    order_items: OrderItem[]
    readonly event: number
    readonly user: number
}

export interface OrderItem {
    readonly id: number
    menu: number
    readonly order: number
    quantity: number
    special_requests: string
}

export enum OrderStatus {
    WAITING = 'Waiting',
    IN_PROGRESS = 'In progress',
    DONE = 'Done',
    DELIVERED = 'Delivered',
}

export interface Organisation {
    readonly id: number
    readonly name: string
    readonly users: User[]
}

export interface User {
    readonly id: number
    readonly username: string
}
