import React from 'react';
import {
    Tooltip,
    FormControlLabel,
    Switch
} from '@mui/material';

export const SwitchInput = ({ id,label, tooltip, ...rest }) => {

    if (tooltip)
        return <Tooltip title={tooltip}>
            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        {...rest}
                    />}
                label={label}
                labelPlacement="start"
            />
        </Tooltip>;
    else
        return <FormControlLabel
            control={
                <Switch
                    color="primary"
                    {...rest}
                />}
            label={label}
            labelPlacement="start"
        />;
}

