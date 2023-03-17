import React, { useEffect } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useMenuItems } from "../../hooks";
import {
    useDeleteOrderMutation,
    useUpdateOrderMutation
} from "../../api/backend";
import OrderTicket from "../OrderTicket";

import { OrderStatus } from "../../@types";
import type { Order } from "../../@types";
import { useSnackbar } from "notistack";

interface OrderDetailProps {
    open: boolean,
    onClose: () => void,
    order: Order | null,
    disableClaim?: boolean,
    disableDelete?: boolean,
    disableDeliver?: boolean,
    onEditOrderClick?: (order: Order) => void,
}

const ACTION_BUTTON_COMMON_PROPS: {} = {
    fullWidth: true,
    size: "large",
    variant: "contained",
};

const LoadingButtonStyle = {
    fontSize: "1.4rem",
    color: "white"
}

export default function OrderDetail({
    open,
    onClose,
    order,
    disableClaim = false,
    disableDelete = false,
    disableDeliver = false,
    onEditOrderClick,
}: OrderDetailProps) {
    const { menuItems } = useMenuItems();
    const [
        claimOrder,
        {
            isError: isClaimError,
            isLoading: isClaimingOrder,
            isSuccess: isClaimSuccess,
            reset: resetClaimOrder,
        },
    ] = useUpdateOrderMutation();
    const [
        deliverOrder,
        {
            isError: isDeliverError,
            isLoading: isDeliveringOrder,
            isSuccess: isDeliverSuccess,
            reset: resetDeliverOrder,
        },
    ] = useUpdateOrderMutation();
    const [
        deleteOrder,
        {
            isError: isDeleteError,
            isLoading: isDeletingOrder,
            isSuccess: isDeleteSuccess,
            reset: resetDeleteOrder,
        },
    ] = useDeleteOrderMutation();
    const { enqueueSnackbar } = useSnackbar();

    const isClaimed = order?.status === OrderStatus.IN_TRANSIT;
    const isLoading = isClaimingOrder || isDeliveringOrder || isDeletingOrder;
    const isError = isClaimError || isDeliverError || isDeleteError;

    function getErrorType() {
        if (isClaimError) {
            return "claim";
        } else if (isDeliverError) {
            return "deliver";
        } else {
            return "delete";
        }
    }

    useEffect(() => {
        let message;
        if (isClaimSuccess) {
            message = "Order claimed";
        } else if (isDeliverSuccess) {
            message = "Order delivered";
        } else if (isDeleteSuccess) {
            message = "Order deleted";
        }
        if (message) {
            onClose();
            enqueueSnackbar(message, { variant: "success" });
        }
    }, [enqueueSnackbar, isClaimSuccess, isDeliverSuccess, isDeleteSuccess, onClose]);

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            onClose={() => {
                if (!isLoading) {
                    onClose();
                }
            }}
            TransitionProps={{
                onExited: () => {
                    resetClaimOrder();
                    resetDeleteOrder();
                    resetDeliverOrder();
                },
            }}
            sx={{ zIndex: 1500 }}
        >
            <DialogTitle
                // @ts-ignore
                align="center"
                variant="h4"
            >
                Order details
            </DialogTitle>
            <DialogContent>
                {order && (
                    <OrderTicket
                        component="div"
                        order={order}
                        menuItems={menuItems}
                    />
                )}
                {isError && (
                    <Alert
                        variant="outlined"
                        severity="error"
                        sx={{ marginTop: 2, marginBottom: -2 }}
                    >
                        {`Could not ${getErrorType()} order.`}
                    </Alert>
                )}
            </DialogContent>
            <Stack spacing={3} padding={3}>
                {!disableClaim && (
                    <LoadingButton
                        {...ACTION_BUTTON_COMMON_PROPS}
                        color="info"
                        disabled={isClaimed || isLoading}
                        loading={isClaimingOrder}
                        onClick={() => {
                            claimOrder({
                                orderId: order!!.id,
                                body: { status: OrderStatus.IN_TRANSIT }
                            });
                        }}
                    >
                        {isClaimed ? "Already claimed": "Claim"}
                    </LoadingButton>
                )}
                {!disableDeliver && (
                    <LoadingButton
                        {...ACTION_BUTTON_COMMON_PROPS}
                        color="success"
                        disabled={isLoading}
                        loading={isDeliveringOrder}
                        sx={LoadingButtonStyle}
                        onClick={() => deliverOrder({
                            orderId: order!!.id,
                            body: {status: OrderStatus.DELIVERED}
                        })}
                    >
                        Mark delivered
                    </LoadingButton>
                )}
                {onEditOrderClick && (
                    <Button
                        {...ACTION_BUTTON_COMMON_PROPS}
                        color="warning"
                        disabled={isLoading}
                        sx={LoadingButtonStyle}
                        onClick={() => {
                            onEditOrderClick(order!!);
                            onClose();
                        }}
                    >
                        Edit
                    </Button>
                )}
                {!disableDelete && (
                    <LoadingButton
                        {...ACTION_BUTTON_COMMON_PROPS}
                        color="error"
                        disabled={isLoading}
                        loading={isDeletingOrder}
                        sx={LoadingButtonStyle}
                        onClick={() => deleteOrder(order!!.id)}
                    >
                        Delete
                    </LoadingButton>
                )}
            </Stack>
        </Dialog>
    );
}
