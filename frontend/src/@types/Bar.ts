import type { MenuItem } from './';

interface CurrentOrderItem extends MenuItem {
    mealNote: string
    quantity: number
}

export enum BarRenderMode {
    FULL,
    DELIVERY,
    HISTORY,
    WAITER,
}

export type { CurrentOrderItem }
