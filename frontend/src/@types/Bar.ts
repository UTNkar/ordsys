import type { MenuItem } from './';

interface CurrentOrderItem extends MenuItem {
    mealNote: string
    quantity: number
}

export enum BarRenderMode {
    Full,
}

export type { CurrentOrderItem }
