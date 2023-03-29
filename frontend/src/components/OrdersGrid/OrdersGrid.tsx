import { memo } from 'react';
import { Grid } from '@mui/material';

import type { Breakpoint } from '@mui/material';
import OrderTicket from '../OrderTicket';

import type { MenuItem, Order } from '../../@types';

interface OrdersGridProps {
  columns?: { [key in Breakpoint]?: number },
  menuItems: MenuItem[],
  orders: Order[],
  onClick?: (order: Order) => void,
}

const DEFAULT_COLUMNS: OrdersGridProps['columns'] = Object.freeze({
  xs: 1,
  sm: 2,
});

const OrdersGrid = memo(({
  columns = DEFAULT_COLUMNS,
  menuItems,
  orders,
  onClick,
}: OrdersGridProps) => {
  const breakpoints = Object.keys(columns).reduce((obj, key) => ({ ...obj, [key]: 1 }), {});

  return (
    <Grid
      container
      columns={columns}
      paddingX={1}
      paddingBottom={1}
      spacing={2}
      overflow="auto"
    >
      {orders.map((order) => (
        <Grid key={order.id} item {...breakpoints}>
          <OrderTicket
            menuItems={menuItems}
            order={order}
            onClick={onClick && (() => onClick(order))}
          />
        </Grid>
      ))}
    </Grid>
  );
});

export default OrdersGrid;
