import { Alert, IconButton, Typography } from "@mui/material";
import {
    CloseRounded as CloseIcon,
    WarningAmberRounded as WarningIcon,
    ErrorOutlineRounded as ErrorIcon,
    CheckCircleOutlineRounded as SuccessIcon,
    InfoOutlined as InfoIcon,
} from "@mui/icons-material";

import type { AlertColor } from "@mui/material";
import type { SnackbarKey } from "notistack";

interface SnackbarContentProps {
    action?: React.ReactNode | ((key: SnackbarKey) => React.ReactNode)
    closeSnackbar: (key?: SnackbarKey) => void,
    message: string,
    severity: AlertColor,
    snackbarKey: SnackbarKey,
}

const ICON_PROPS = Object.freeze({ sx: { fontSize: "2rem" }});

const ICON_MAPPING: Record<AlertColor, React.ReactNode> = Object.freeze({
    error: <ErrorIcon {...ICON_PROPS} />,
    info: <InfoIcon {...ICON_PROPS} />,
    success: <SuccessIcon {...ICON_PROPS} />,
    warning: <WarningIcon {...ICON_PROPS} />,
});

const SnackbarContent = React.forwardRef<HTMLDivElement, SnackbarContentProps>(({
    action,
    closeSnackbar,
    message,
    snackbarKey,
    severity,
}, ref) => {
    const _action = typeof action === "function" ? action(snackbarKey) : action;

    return (
        <Alert
            ref={ref}
            action={_action || (
                <IconButton
                    aria-label="Close"
                    color="inherit"
                    onClick={() => closeSnackbar(snackbarKey)}
                >
                    <CloseIcon />
                </IconButton>
            )}
            iconMapping={ICON_MAPPING}
            severity={severity}
            variant="filled"
            sx={{
                color: (theme) => theme.palette[severity].contrastText,
                minWidth: 300,
                boxShadow: 24,
            }}
        >
            <Typography
                fontSize="1.5rem"
                lineHeight="1.25"
            >
                {message}
            </Typography>
        </Alert>
    );
});

export default SnackbarContent;
