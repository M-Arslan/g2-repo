import React from 'react';
import { makeStyles } from '@mui/styles';
import {
    Button,
    Modal,
    IconButton
} from '@mui/material';
import styled from 'styled-components';
import { Close as CloseIcon } from '@mui/icons-material';

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
    onGridPosition: {
        float:"right",
        bottom: "3px"
    }
}));

const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: center;
`;

function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        backgroundColor: "white"
    };
}

export default function({ node }) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const pathName = window.location.pathname;
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
   

    function truncate(str) {
        if (str) {
            return str.substring(0, 75);
        }
        else {
            return "";
        }
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <ContentRow>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </ContentRow>
            <p id="simple-modal-description" style={{ wordWrap: 'break-word' }}>
                {node.data?.body}
            </p>
        </div>
    );
    const commentBody = (
        <div style={modalStyle} className={classes.paper}>
            <ContentRow>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </ContentRow>
            <p id="simple-modal-description" style={{ wordWrap: 'break-word' }}>
                {node.data?.comment}
            </p>
        </div>
    );

    if (node?.data?.comment) {
        return (

            <span>
                {node.data?.comment?.length < 100 ? node.data?.comment : (
                    node.data?.comment !== null && node.data?.comment !== '' ?
                        <span>
                            {truncate(node.data?.comment)}...
                            <Button type="button" color="primary" onClick={handleOpen} className={classes.onGridPosition}>
                                Read More
                            </Button> 
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                {commentBody}
                            </Modal>

                        </span>
                        : null

                )}
            </span>

        );
    }

    return (

        <span>
            {node.data?.body && node.data?.body?.length < 100 ? node.data?.body : (
                node.data?.body !== null && node.data?.body !== '' ?
                <span>
                        {truncate(node.data?.body)}...
                        {pathName !== '/claimSupportDashboard' ? <Button type="button" color="primary" onClick={handleOpen} className={classes.onGridPosition}>
                            Read More
                        </Button> : null}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        {body}
                    </Modal>

                </span>
                : null
                
            )}
        </span>

    );

}

