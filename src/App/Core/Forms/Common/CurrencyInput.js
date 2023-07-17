import { TextField, Tooltip } from '@mui/material';
import React from 'react';
import CurrencyFormat from 'react-currency-format';
import { makeEvent } from '../../Utility/makeEvent';
import { ensureNonEmptyString } from '../../Utility/rules';


export const CurrencyInput = ({ id, tooltip, name, value, onChange, onStdChange, onBlur, onStdBlur, label, allowDecimal = false, allowNegative = false, ...rest }) => {

    const onValueChange = (obj) => {
        let val = null;//(allowDecimal !== true && obj.value <= 999999999 ? obj.value.split('.')[0] : obj.value);

        if (allowDecimal !== true) {
            val = obj.value.split('.')[0];
        } else {
            val = obj.value;
        }

        if (!isNaN(parseFloat(obj.value)) && parseFloat(obj.value) > 999999999.99) {
            val = value;
        }

        val = (ensureNonEmptyString(val) ? val : null);
        if (obj.value.split('.').length > 1 && obj.value.split('.')[1].length > 2) {
            val = value;
        }
        if (typeof onChange === 'function') {
            //onChange(name, (val));
            onChange({
                target: {
                    name,
                    value: allowDecimal ? val : parseInt(val)
                }
            });
        }
        
        if (typeof onStdChange === 'function') {
            onStdChange({
                target: {
                    name,
                    value: (ensureNonEmptyString(val) ? parseInt(val.replace(/[^\d]/g, '')) : null)
                }
            });
        }
    }

    const onFieldBlur = (evt) => {

        const { name, value } = evt.target;

        if (typeof onBlur === 'function') {
            onBlur(evt);
        }

        if (typeof onStdBlur === 'function') {
            onStdBlur(makeEvent(name, (ensureNonEmptyString(value) ? parseInt(value.replace(/[^\d]/g, '')) : null)));
        }

    }

    if (isNaN(parseInt(value))) {
        value = "";
    }
    //value = value ? value : "";
    if (tooltip)
        return <Tooltip title={tooltip}>
            <CurrencyFormat isNumericString={true} label={label} id={id} name={name} value={value} customInput={TextField} onValueChange={onValueChange} onBlur={onFieldBlur} thousandSeparator={true} fullWidth={true} variant="outlined" size="small" prefix={'$'} allowNegative={allowNegative} {...rest} />
        </Tooltip>;
    else
        return <CurrencyFormat isNumericString={true} label={label} id={id} name={name} value={value} customInput={TextField} onValueChange={onValueChange} onBlur={onFieldBlur} thousandSeparator={true} fullWidth={true} variant="outlined" size="small" prefix={'$'} allowNegative={allowNegative} {...rest} />;

}