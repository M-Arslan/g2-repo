import React from 'react';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {
    makeStyles
} from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    onGridPosition: {
        position: "fixed",
        top: "-6px"
    }
}));
export default function DeleteChildRenderer({ node, colDef }) {
    const classes = useStyles();
    const handleReadByClick = () => {
    }

    React.useEffect(() => {
    }, [])
    return (
        <span>
            <IconButton name="Remove" title="Remove" onClick={handleReadByClick} className={classes.onGridPosition}><DeleteIcon color="primary" /></IconButton>
        </span>

    );
}
export function EditChildRenderer({ node, colDef }) {
    const classes = useStyles();
    const handleReadByClick = () => {
    }

    React.useEffect(() => {
    }, [])
    return (
        <span>
            <IconButton name="Edit" title="Edit" onClick={handleReadByClick} className={classes.onGridPosition}><EditIcon color="primary" /></IconButton>
        </span>

    );
}
