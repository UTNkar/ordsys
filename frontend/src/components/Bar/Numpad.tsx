import React from 'react';
import { Button, FormControl, Grid, OutlinedInput } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import { FaPaperPlane } from 'react-icons/fa';

interface NumpadProps {
    addToOrderNumber: (digit: number) => void
    clearOrderNumber: () => void
    onOrderNoteChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSubmitOrder: (event: React.FormEvent<HTMLFormElement>) => void
    orderIsValid: boolean
    orderNumber: string
    orderNote: string
    showSubmitSpinner: boolean
}

const COMMON_NUMPAD_BUTTON_PROPS: {} = {
    fullWidth: true,
    variant: "contained",
    size: "large",
    sx: {
        fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
        height: "100%",
    },
};

export default function Numpad({
    addToOrderNumber,
    clearOrderNumber,
    onOrderNoteChange,
    onSubmitOrder,
    orderIsValid,
    orderNumber,
    orderNote,
    showSubmitSpinner,
}: NumpadProps) {
    const numpadItems = [
        { label: 1, onClick: () => addToOrderNumber(1) },
        { label: 2, onClick: () => addToOrderNumber(2) },
        { label: 3, onClick: () => addToOrderNumber(3) },
        { label: 4, onClick: () => addToOrderNumber(4) },
        { label: 5, onClick: () => addToOrderNumber(5) },
        { label: 6, onClick: () => addToOrderNumber(6) },
        { label: 7, onClick: () => addToOrderNumber(7) },
        { label: 8, onClick: () => addToOrderNumber(8) },
        { label: 9, onClick: () => addToOrderNumber(9) },
        { label: "C", onClick: clearOrderNumber },
        { label: 0, onClick: () => addToOrderNumber(0) },
    ];

    return (
        <form onSubmit={onSubmitOrder} noValidate>
            <FormControl margin="dense" fullWidth size="small">
                <OutlinedInput
                    aria-label="Order note"
                    label="Order note"
                    notched={false}
                    placeholder="Order note"
                    value={orderNote}
                    onChange={onOrderNoteChange}
                    sx={{
                        fontSize: "1.35rem",
                        "& > input": { textAlign: "center" },
                    }}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth size="small">
                <OutlinedInput
                    aria-label="Order number"
                    label="Order number"
                    notched={false}
                    placeholder="Order number"
                    readOnly
                    value={orderNumber}
                    sx={{
                        fontSize: "1.35rem",
                        "& > input": { textAlign: "center" },
                        "& > input:hover": {
                            cursor: "default",
                        },
                    }}
                />
            </FormControl>
            <Grid container columns={3} spacing={1}>
                {numpadItems.map(({ label, onClick }) => (
                    <Grid key={label} item xs={1}>
                        <Button
                            {...COMMON_NUMPAD_BUTTON_PROPS}
                            onClick={onClick}
                        >
                            {label}
                        </Button>
                    </Grid>
                ))}
                <Grid item xs={1}>
                    <LoadingButton
                        {...COMMON_NUMPAD_BUTTON_PROPS}
                        aria-label="Submit order"
                        color="success"
                        disabled={!orderIsValid}
                        loading={showSubmitSpinner}
                        type="submit"
                    >
                        <FaPaperPlane
                            color={!orderIsValid || showSubmitSpinner ? "#000" : "#fff"}
                        />
                    </LoadingButton>
                </Grid>
            </Grid>
        </form>
    );
}
