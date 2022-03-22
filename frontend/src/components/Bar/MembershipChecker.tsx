import React, { useEffect, useRef, useState } from 'react';
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from 'notistack';

import { useCheckMembershipMutation } from "../../api/utn";

export default function MembershipChecker() {
    const [
        checkUtnMembership,
        {
            data,
            error,
            isError,
            isLoading,
            isSuccess,
            isUninitialized,
            reset,
        },
    ] = useCheckMembershipMutation();
    const { enqueueSnackbar } = useSnackbar();
    const personalIdInputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null)
    const [personalId, setPersonalId] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setPersonalId("");
            personalIdInputRef.current?.focus()
            // Show the result colour for 2500 ms before resetting to original state
            const timeoutId = setTimeout(reset, 2500);

            return () => clearTimeout(timeoutId);
        }
    }, [enqueueSnackbar, isSuccess, reset]);

    function onCheckMembership(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        checkUtnMembership(personalId);
    }

    const isMember = data?.is_member;

    let buttonText;
    if (isUninitialized || isLoading) {
        buttonText = "Check UTN membership";
    } else if (isMember) {
        buttonText = "Is a member";
    } else {
        buttonText = "Not a member";
    }

    return (
        <Stack
            alignItems={{ xs: "center", xl: "flex-start" }}
            justifyContent="center"
            direction={{ xs: "column", xl: "row" }}
            spacing={1.5}
            border={(theme) => `1px solid ${theme.palette.divider}`}
            borderRadius={1}
            padding={2}
            component="form"
            autoComplete="off"
            noValidate
            onSubmit={onCheckMembership}
        >
            <TextField
                disabled={isLoading}
                error={isError}
                helperText={!isError
                    ? "YYYYMMDD-XXXX"
                    : typeof error === "boolean"
                        ? "Not a valid personal ID."
                        : "Network error."
                }
                inputRef={personalIdInputRef}
                fullWidth
                label='Swedish personal ID'
                onChange={e => {
                    reset();
                    setPersonalId(e.target.value)
                }}
                size="small"
                value={personalId}
                variant='outlined'
            />
            <LoadingButton
                color={isUninitialized || isLoading
                    ? "primary"
                    : isMember
                        ? "success"
                        : "error"
                }
                disabled={isError || (personalId.length === 0 && !isSuccess)}
                disableElevation
                loading={isLoading}
                fullWidth
                variant={isSuccess ? "contained" : "outlined"}
                type="submit"
                sx={{ height: "2.5rem" }}
            >
                {buttonText}
            </LoadingButton>
        </Stack>
    )
}
