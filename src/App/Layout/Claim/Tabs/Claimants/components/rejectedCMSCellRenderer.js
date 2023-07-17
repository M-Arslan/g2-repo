import React from 'react';
import {
    Modal,
    Button,
    IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import styled from 'styled-components';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../../../../Core/State/slices/user';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    datepickerHeight: {
        height: 25,
    },
    gridButton: {
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
    },
    iconButton: {
        paddingRight: '5px !important',
        paddingLeft: '5px !important',
    },
    paper: {
        position: 'absolute',
        width: 500,
        
        border: '1px solid #000',

        padding: '2em',
        overflowY: 'scroll',
        maxHeight: 500
    },
}));
const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


export default function ({ node, colDef }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    function truncate(str) {
        return str?.substring(0, 30);
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <ContentRow>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </ContentRow>
            <p id="simple-modal-description" style={{ wordWrap: 'break-word' }}>
                {node.data.rejectReason}
            </p>
        </div>
    );

    return (

        <span>
            {node.data.rejectReason && node.data.rejectReason?.length < 80  ? node.data.rejectReason : (
                <span>
                    {truncate(node.data.rejectReason)}...
                    <Button type="button" color="primary" onClick={handleOpen}>
                        Read More
                     </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        {body}
                    </Modal>

                </span>
            )}
        </span>

    );

}