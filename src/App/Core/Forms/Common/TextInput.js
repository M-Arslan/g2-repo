import React from 'react';
import {
    TextField,
    Tooltip
} from '@mui/material';

export const TextInput = ({ id, tooltip, ...rest }) => {

    if (tooltip)
        return <Tooltip title={tooltip}><TextField id={id} name={id} variant="outlined" size="small" fullWidth={true} autoComplete="new-password" {...rest} /></Tooltip>;
    else
        return <TextField id={id} name={id} variant="outlined" size="small" fullWidth={true} autoComplete="new-password" {...rest} />;

}

