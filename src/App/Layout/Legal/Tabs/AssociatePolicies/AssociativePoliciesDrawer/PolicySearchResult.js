import React from 'react';
import {
    ListItemAvatar,
    ListItemText,
    Avatar
} from '@mui/material';
import {
    FileCopy
} from '@mui/icons-material';


export const PolicySearchResult = ({ policy }) => (
    <>
        <ListItemAvatar>
            <Avatar><FileCopy /></Avatar>
        </ListItemAvatar>
        <ListItemText primary={policy.policyID} secondary={
            <span>
                {`${policy.policyID || ''} ${policy.insuredName || ''}`}
                <br />
                {/*{`${claim.statusText || ''}`}*/}
            </span>
        } />
    </>
);