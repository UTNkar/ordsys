import { Divider, Stack } from '@mui/material';

import { useOrders } from '../../hooks';
import PickupColumn from './PickupColumn';

import { OrderStatus } from '../../@types';
import type { Order } from '../../@types';

function isOrderDone(order: Order) {
  return order.status === OrderStatus.DONE;
}

function isOrderInProgress(order: Order) {
  return !isOrderDone(order);
}

function Pickup() {
  const { orders } = useOrders(`?exclude_status=${OrderStatus.DELIVERED}`, false);
  const doneOrders = orders.filter(isOrderDone);
  const ordersInProgress = orders.filter(isOrderInProgress);

  return (
    <Stack direction="row" flexGrow={1} padding={4} spacing={4} overflow="hidden">
      <PickupColumn done={false} orders={ordersInProgress} />
      <Divider orientation="vertical" />
      <PickupColumn done orders={doneOrders} />
    </Stack>
  );
}

export default Pickup;
