import { Grid, Typography } from '@mui/material';

import type { MenuItem, Order } from '../../@types';

interface KitchenStatisticsListProps {
  menuItems: MenuItem[],
  orders: Order[],
}

export default function KitchenStatisticsList({
  menuItems,
  orders,
}: KitchenStatisticsListProps) {
  const allOrderItems = orders.flatMap((order) => order.order_items);
  const items = menuItems
    .filter((menuItem) => menuItem.active)
    .map((menuItem) => ({
      id: menuItem.id,
      name: menuItem.item_name,
      quantity: allOrderItems
        .filter((orderItem) => orderItem.menu === menuItem.id)
        .reduce((count, orderItem) => count + orderItem.quantity, 0),
    }))
    .filter(({ quantity }) => quantity > 0);

  return (
    <Grid container columns={2} spacing={1} sx={{ paddingLeft: 1.5 }}>
      {items.map(({ id, name, quantity }) => (
        <Grid item xs={1} key={id}>
          <Typography component="p" variant="h6">
            {`${quantity}x ${name}`}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
