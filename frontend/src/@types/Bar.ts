import type { MenuItem } from './';

interface CurrentOrderItem extends MenuItem {
    mealNote: string
    quantity: number
}

export enum BarRenderMode {
    FULL,
    DELIVERY,
}

export type { CurrentOrderItem }
