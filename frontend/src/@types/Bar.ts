import type { MenuItem } from '.';

interface CurrentOrderItem extends MenuItem {
  mealNote: string
  quantity: number
}

export enum BarRenderMode {
  FULL,
  WAITER,
}

export type { CurrentOrderItem };
