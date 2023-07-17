import React from 'react';
import {
    Select,
    FormControl,
    InputLabel,
    FormHelperText,
    MenuItem,
    Tooltip
} from '@mui/material';

export const SelectList = ({ id, children, value, onChange, label, variant, required, error, helperText, tooltip, allowempty = true , ...rest }) => {

    const labelid = `${id}__label`;

    if (tooltip)
        return (
            <FormControl size="small" required={required} fullWidth={true} variant={variant} error={error}>
                <InputLabel id={labelid}>{label}</InputLabel>
                <Tooltip title={tooltip}>
                    <Select
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        fullWidth={true}
                        label={label}
                        labelId={labelid}
                        variant={variant}
                        displayEmpty={true}
                        {...rest}
                    >
                        <MenuItem disabled={allowempty ? false : true} value="">{" "}</MenuItem> 
                        {children}
                    </Select>
                </Tooltip>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    else
        return (
            <FormControl size="small" required={required} fullWidth={true} variant={variant} error={error}>
                <InputLabel id={labelid}>{label}</InputLabel>
                <Select
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    fullWidth={true}
                    label={label}
                    labelId={labelid}
                    variant={variant}
                    displayEmpty={true}
                    {...rest}
                >
                    <MenuItem disabled={allowempty ? false : true} value="">{" "}</MenuItem>
                    {children}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
}