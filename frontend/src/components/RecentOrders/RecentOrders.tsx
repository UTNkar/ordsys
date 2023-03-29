import { Container, Typography } from '@mui/material';

import { useMenuItems, useOrdersWithItems } from '../../hooks';
import OrdersGrid from '../OrdersGrid';
import OrdersGridWithDetail from '../OrdersGridWithDetail';

import { OrderStatus } from '../../@types';

interface RecentOrdersProps {
  history?: boolean,
  title: string,
}

const COLUMNS = Object.freeze({ xs: 1, sm: 2, lg: 3 });

export default function RecentOrders({
  history = false,
  title,
}: RecentOrdersProps) {
  const { menuItems } = useMenuItems();
  const { orders } = useOrdersWithItems(
    history ? '?max_hours=1' : `?exclude_status=${OrderStatus.DELIVERED}`,
    history,
  );

  const Component = history ? OrdersGrid : OrdersGridWithDetail;

  return (
    <Container sx={{ paddingY: 4 }} maxWidth="xl">
      <Typography
        align="center"
        component="h1"
        fontWeight="bold"
        marginBottom={3.75}
        variant="h3"
      >
        {title}
      </Typography>
      <Component
        columns={COLUMNS}
        menuItems={menuItems}
        orders={orders}
      />
    </Container>
  );
}
