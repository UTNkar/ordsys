import React from 'react';
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import {
    AddRounded as IncrementIcon,
    RemoveRounded as DecrementIcon,
} from '@mui/icons-material';

import type { CurrentOrderItem } from '../../@types';

interface CurrentOrderProps {
    currentOrder: CurrentOrderItem[]
    decrementItemQuantity: (item: CurrentOrderItem) => void
    incrementItemQuantity: (item: CurrentOrderItem) => void
}

const CurrentOrder = React.memo(function CurrentOrder({
    currentOrder,
    decrementItemQuantity,
    incrementItemQuantity
}: CurrentOrderProps) {
    return (
        <List dense>
            {currentOrder.map((item) => (
                <ListItem key={item.id + item.mealNote}>
                    <IconButton
                        aria-label="increment item count"
                        onClick={() => incrementItemQuantity(item)}
                    >
                        <IncrementIcon />
                    </IconButton>
                    <IconButton
                        aria-label="decrement item count"
                        onClick={() => decrementItemQuantity(item)}
                        sx={{ marginLeft: 0.5 }}
                    >
                        <DecrementIcon />
                    </IconButton>
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography variant="h5" component="p">
                                {`${item.quantity}x ${item.item_name}`}
                            </Typography>
                        }
                        secondary={item.mealNote && (
                            <Typography
                                component="p"
                                fontWeight="bold"
                                marginLeft={2}
                                variant="h6"
                            >
                                {item.mealNote}
                            </Typography>
                        )}
                        sx={{ marginLeft: 1 }}
                    />
                </ListItem>
            ))}
        </List>
    );
});

export default CurrentOrder
