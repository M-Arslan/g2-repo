import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import Button from '@mui/material/IconButton';
import {
    TextInput
} from './TextInput';


export function ConfirmationDialog(props) {
    const { onCancel, onOk, title, description, open, okText, cancelText, ...other } = props;


    const handleCancel = () => {
        onCancel();
    };

    const handleOk = () => {
        onOk();
    };


    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOk} color="primary">
                    {okText ? okText : "OK"}
                </Button>
                <Button autoFocus onClick={handleCancel} color="primary">
                    {cancelText ? cancelText : "Cancel"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}


export function UserInputDialog(props) {
    const { onCancel, onOk, title, description, open, label, okText, cancelText,  ...other } = props;

    const [text, setText] = React.useState('');
    const [isValid, setIsValid] = React.useState(true);

    const handleCancel = () => {
        setText('');
        setIsValid(true);
        onCancel();
    };

    const handleOk = () => {

        if (!text.trim())
            setIsValid(false);
        else {
            onOk(text);
            setText('');
            setIsValid(true);
        }
    };


    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            //maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent dividers>
                <TextInput
                    id=""
                    name=""
                    fullWidth={true}
                    onChange={(e) => setText(e.target.value.trimStart())}
                    variant="outlined"
                    value={text}
                    error={!isValid}
                    helperText={!isValid ? "This field is required." : ""}
                    label={label}
                    style={{ width: 400 }}
                    multiline
                    rows={4}
                    inputProps={{ maxlength: 500 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOk} color="primary">
                    {okText ? okText : "OK"}
                </Button>
                <Button autoFocus onClick={handleCancel} color="primary">
                    {cancelText ? cancelText : "Cancel"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
