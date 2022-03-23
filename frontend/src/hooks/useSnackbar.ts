import React, { useCallback } from "react";
import { useSnackbar as useSnackbarInternal } from "notistack";

import SnackbarContent from "../components/SnackbarContent";

import type { AlertColor } from "@mui/material";
import type { OptionsObject, VariantType } from "notistack";

type SnackbarOptions = OptionsObject & { variant: Exclude<VariantType, "default"> };

export function useSnackbar() {
    const {
        closeSnackbar,
        enqueueSnackbar: enqueueSnackbarInternal,
    } = useSnackbarInternal();

    const enqueueSnackbar = useCallback(
        (message: string, options?: SnackbarOptions) => {
            const variant = options?.variant || "info";
            enqueueSnackbarInternal(message, {
                ...options,
                variant,
                content: (snackbarKey) => (
                    React.createElement(
                        SnackbarContent,
                        {
                            action: options?.action,
                            closeSnackbar,
                            message,
                            severity: variant as AlertColor,
                            snackbarKey,
                        },
                    )
                ),
            });
        },
        [closeSnackbar, enqueueSnackbarInternal],
    );

    return { closeSnackbar, enqueueSnackbar };
}
