import { useCallback } from "react";
import { useSnackbar as useSnackbarInternal } from "notistack";

import type { AlertColor } from "@mui/material";
import type { OptionsObject, VariantType } from "notistack";

type SnackbarOptions = OptionsObject & {
  variant: Exclude<VariantType, "default">;
};

export function useSnackbar() {
  const { closeSnackbar, enqueueSnackbar: enqueueSnackbarInternal } =
    useSnackbarInternal();

  const enqueueSnackbar = useCallback(
    (message: string, options?: SnackbarOptions) => {
      const variant = (options?.variant || "info") as AlertColor;
      enqueueSnackbarInternal(message, {
        ...options,
        variant,
      });
    },
    [enqueueSnackbarInternal]
  );

  return { closeSnackbar, enqueueSnackbar };
}
