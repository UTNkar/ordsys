import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface HeaderDialogProps {
    openLogoutModal: boolean,
    setOpenLogoutModal: Function,
    callback: Function,
    dialogTitle: String,
    dialogContent: String,
}

export default function HeaderDialog(props: HeaderDialogProps) {

    const handleClickNo = () => {
        props.setOpenLogoutModal(false);
    };
    const handleClickYes = () => {
        props.setOpenLogoutModal(false);
        props.callback()
    };

    return (
        <Dialog
            open={props.openLogoutModal}
            onClose={handleClickNo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {props.dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogContent}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickNo}>No</Button>
                <Button onClick={handleClickYes} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}