import React from 'react';
import { Tooltip } from '@mui/material';
import { ensureNonEmptyString } from '../../Utility/rules';

export const withTooltip = (Component) => {
    return (tooltip, ...rest) => {
        return (ensureNonEmptyString(tooltip) ? <Tooltip title={tooltip}><Component {...rest} /></Tooltip> : <Component {...rest} />);
    }
}