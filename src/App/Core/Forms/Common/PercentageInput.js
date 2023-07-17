import { TextField, Tooltip } from '@mui/material';
import React from 'react';
import CurrencyFormat from 'react-currency-format';

export const PercentageInput = ({ id, tooltip, name, value, onChange, onBlur, label, ...rest }) => {

    const onValueChange = (obj) => {
        if (obj.value <= 100)
            onChange(name, obj.value === "" ? null : obj.value);
        else
            onChange(name, value === "" ? null : value);
    }

    value = value ? value : "";
    if (tooltip)
        return <Tooltip title={tooltip}>
            <CurrencyFormat isNumericString={true} label={label} id={id} name={name} value={value} customInput={TextField} onValueChange={onValueChange} onBlur={onBlur} thousandSeparator={true} fullWidth={true} variant="outlined" size="small" suffix={' %'} allowNegative={false} {...rest} />
        </Tooltip>;
    else
        return <CurrencyFormat isNumericString={true} label={label} id={id} name={name} value={value} customInput={TextField} onValueChange={onValueChange} onBlur={onBlur} thousandSeparator={true} fullWidth={true} variant="outlined" size="small"  suffix={' %'} allowNegative={false} {...rest} />;

}
