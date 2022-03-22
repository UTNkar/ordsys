import React from "react";
import { Container, Typography } from "@mui/material";

import { useMenuItems, useOrdersWithItems } from "../../hooks";
import OrdersGrid from "../OrdersGrid";

const COLUMNS = Object.freeze({ xs: 1, sm: 2, lg: 3 });

export default function RecentOrders() {
    const { menuItems } = useMenuItems();
    const { orders } = useOrdersWithItems("?max_hours=1", true);

    return (
      <Container sx={{ paddingY: 4 }} maxWidth="xl">
          <Typography
              align="center"
              component="h1"
              fontWeight="bold"
              marginBottom={3.75}
              variant="h3"
          >
              Orders last hour
          </Typography>
          <OrdersGrid
              columns={COLUMNS}
              menuItems={menuItems}
              orders={orders}
          />
      </Container>
    );
}
