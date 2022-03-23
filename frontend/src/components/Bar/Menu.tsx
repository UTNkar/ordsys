import React from 'react';
import { Button, Grid, Typography } from "@mui/material";

import { useActiveMenuItems } from "../../hooks";

import type { MenuItem } from '../../@types';

interface MenuProps {
    onMenuItemClick: (item: MenuItem) => void
}

const Menu = React.memo(function Menu({ onMenuItemClick }: MenuProps) {
    const { activeMenuItems } = useActiveMenuItems();

    if (activeMenuItems.length === 0) {
        return (
            <Typography component="p" variant="h5">
                No menu items found.
            </Typography>
        )
    }

    return (
        <Grid paddingY={2} container spacing={2} columns={{ xs: 1, lg: 2 }}>
            {activeMenuItems.map((item) => (
                <Grid key={item.id} item xs={1} lg={1}>
                    <Button
                        fullWidth
                        onClick={() => onMenuItemClick(item)}
                        variant="contained"
                        size="large"
                        sx={{
                            padding: {
                                xs: undefined,
                                md: "12px",
                                lg: "15px"
                            },
                            fontSize: "1.25rem"
                        }}
                    >
                        {item.item_name}
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
});

export default Menu
