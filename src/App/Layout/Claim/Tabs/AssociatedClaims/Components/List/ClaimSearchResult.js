import React from 'react';
import {
    ListItemAvatar,
    ListItemText,
    Avatar
} from '@mui/material';
import {
    FileCopy
} from '@mui/icons-material';


export const ClaimSearchResult = ({ claim }) => (
    <>
        <ListItemAvatar>
            <Avatar><FileCopy /></Avatar>
        </ListItemAvatar>
        <ListItemText primary={claim.claimID} secondary={
            <span>
                {`${claim.policyID || ''} ${claim.insuredName || ''}`}
                <br />
                {`${claim.statusText || ''}`}
            </span>
        } />
    </>
);