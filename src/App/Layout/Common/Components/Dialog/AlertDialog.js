import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AlertDialogSlide = ({ condition, setCondition, buttonMessage, setShowPolicyRescissionData, showPolicyRescissionData, children} ) => {
    console.log("checking children", children)
    const handleClose = () => {
        setCondition(false);

    };
    return (
        <div>
            <Dialog
                open={condition}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"

            >
                {!showPolicyRescissionData && <DialogTitle style={{
                    color: '#e57373',
                }}>Warning</DialogTitle>}
                <DialogContent>
                    
                    <DialogContentText id="alert-dialog-slide-description" style={{
                        fontWeight: 'bold'
                    }}>
                        {children}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { !showPolicyRescissionData ? setShowPolicyRescissionData(true) : handleClose() }}>{buttonMessage}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
