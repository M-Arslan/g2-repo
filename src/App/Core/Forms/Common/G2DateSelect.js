import React from 'react';
import {
    DatePicker as KeyboardDatePicker
} from '@mui/lab';
import {
    makeEvent
} from '../../Utility/makeEvent';
import {
    ensureNonEmptyString,
} from '../../Utility/rules';
import { G2Date } from '../../Utility/G2Date';

export const G2DateSelect = ({ onChange, onBlur, id, value, label, minDate, maxDate, ...rest }) => {

    const [val, setVal] = React.useState(G2Date.tryParse(value).toString());
    const [shrink, setShrink] = React.useState(ensureNonEmptyString(value));

    const min = (minDate || '1921-01-01');
    const max = (maxDate || `${(new Date()).getFullYear() + 100}-12-31`);

    const valueChanged = (date, val) => {
        if (rest.readOnly === true) {
            return;
        }

        try {
            const thisYear = (new Date()).getFullYear();
            const dateObj = Date.parse(date);
            const targetYear = (new Date(dateObj)).getFullYear();
            if (!isNaN(dateObj) && (targetYear <= (thisYear + 100) && targetYear > 1921)) {
                setShrink(ensureNonEmptyString(val));
                const evt = makeEvent(id, val);

                if (typeof onChange === 'function') {
                    onChange(evt);
                }

                if (typeof onBlur === 'function') {
                    onBlur(evt);
                }
            }
        }
        catch (ex) {
            console.warn(`Invalid date entered into ${id}`, ex);
        }
    };

    return <KeyboardDatePicker
        variant="inline"
        format="MM/DD/YYYY"
        margin="none"
        id={id}
        name={id}
        label={label}
        value={value || ''}
        minDate={min}
        maxDate={max}
        onChange={valueChanged}
        autoOk={true}
        KeyboardButtonProps={{
            'aria-label': 'change date',
        }}
        InputLabelProps={{ shrink: shrink }}
        inputVariant="outlined"
        size="small"
        fullWidth={true}
        inputProps={{ readOnly: (rest.readOnly === true) }}
        {...rest}
    />;
}