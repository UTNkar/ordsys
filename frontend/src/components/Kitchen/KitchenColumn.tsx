import { PropsWithChildren } from 'react';
import {
  Box, List, Stack, Typography,
} from '@mui/material';

import OrderTicket from '../OrderTicket';

import type { MenuItem, Order } from '../../@types';

interface KitchenColumnProps {
  menuItems: MenuItem[],
  orders: Order[],
  title: string,
}

export default function KitchenColumn({
  children,
  menuItems,
  orders,
  title,
}: PropsWithChildren<KitchenColumnProps>) {
  return (
    <Stack flexBasis={0} flexGrow={1}>
      <Typography
        align="center"
        component="h2"
        fontWeight="bold"
        gutterBottom
        variant="h4"
      >
        {title}
      </Typography>
      <Box flex="4 1 0" paddingX={0.75} overflow="auto">
        <List sx={{ '& > *:not(:first-of-type)': { marginTop: 2 } }}>
          {orders.map((order) => (
            <OrderTicket
              key={order.id}
              buttons
              component="li"
              disableStatus
              menuItems={menuItems}
              order={order}
            />
          ))}
        </List>
      </Box>
      {children && <Box flex="1 1 0">{children}</Box>}
    </Stack>
  );
}
