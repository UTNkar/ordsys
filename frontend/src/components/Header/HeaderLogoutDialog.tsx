import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface HeaderLogoutDialogProps {
    openLogoutModal: boolean,
    setOpenLogoutModal: Function
}

export default function HeaderLogoutDialog(props: HeaderLogoutDialogProps) {

    const handleClickNo = () => {
        props.setOpenLogoutModal(false);
    };
    const handleClickYes = () => {
        props.setOpenLogoutModal(false);
        console.log("Logout here")
    };

    return (
        <div>
            <Dialog
                open={props.openLogoutModal}
                onClose={handleClickNo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Log out?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClickNo}>No</Button>
                    <Button onClick={handleClickYes} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}