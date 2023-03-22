import { memo } from 'react';
import { Button, Grid, Typography } from "@mui/material";

import { useActiveMenuItems } from "../../hooks";

import type { MenuItem } from '../../@types';
import { Masonry } from '@mui/lab';

interface MenuProps {
    onMenuItemClick: (item: MenuItem) => void
}

const Menu = memo(function Menu({ onMenuItemClick }: MenuProps) {
    const { activeMenuItems } = useActiveMenuItems();

    if (activeMenuItems.length === 0) {
        return (
            <Typography component="p" variant="h5">
                No menu items found.
            </Typography>
        )
    }

    return (
        <Masonry sx={{margin: 0}} spacing={2} columns={{ xs: 1, lg: 2 }}>
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
                            fontSize: "1.75rem"
                        }}
                    >
                        {item.item_name}
                    </Button>
                </Grid>
            ))}
        </Masonry>
    );
});

export default Menu
