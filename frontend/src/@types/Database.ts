export interface MenuItem {
  readonly id: number
  readonly item_name: string
  readonly active: boolean
  readonly beverage: boolean
  readonly org: number
}

export interface Order {
  readonly id: number
  readonly beverages_only: boolean
  customer_number: string
  readonly created_timestamp: string
  delivered_timestamp: string
  note: string
  status: OrderStatus
  order_items: OrderItem[]
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
  IN_TRANSIT = 'In transit',
  DONE = 'Done',
  DELIVERED = 'Delivered',
}

export enum OrganisationTheme {
  UTN = 'utn',
  UTNARM = 'utnarm',
  TEKNOLOG_DATAVETARMOTTAGNINGEN = 'td',
  KLUBBVERKET = 'klubbverket',
  FORSRANNINGEN = 'forsranningen',
  REBUSRALLYT = 'rebusrallyt',
}

export interface Organisation {
  readonly id: number
  readonly name: string
  readonly theme: OrganisationTheme
  readonly users: User[]
}

export interface User {
  readonly id: number
  readonly username: string
}

export enum DatabaseChangeType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
