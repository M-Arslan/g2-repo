import React from 'react';
import {
    DesktopDatePicker
} from '@mui/x-date-pickers/DesktopDatePicker';
import {
    TextField,
} from '@mui/material';
import {
    makeEvent
} from '../../Utility/makeEvent';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../Utility/rules';
import {
    makeStyles,
} from '@mui/styles';
const useStyles = makeStyles((theme) => ({
    datePicker: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    helperText: {
        color: "#d32f2f",
        fontSize: "10px",
        margin: "4px 14px 0px 14px"
    }

}));
const addLeadingZero = (num) => {
    return `${num}`.padStart(2, '0');
}

const DatePickerComponent = ({ onChange, onBlur,error, id, value, label, minDate, maxDate, inputProps, tooltip, helperText, ...rest }) => {
    const {disableFuture} = rest;
    const classes = useStyles();
    const isReadonly = () => (ensureNonNullObject(inputProps) && inputProps.readOnly === true);

    //const [shrink, setShrink] = React.useState(ensureNonEmptyString(value));
    const [displayValue, setDisplayValue] = React.useState(convertUTCDateToLocalDate(new Date(value)));
    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
        return newDate;   
    }
    React.useEffect(() => {
        if (ensureNonEmptyString(value) || value instanceof Date) {
            const dt = new Date(value);
            const d = dt.toISOString().split('T')[0];
            //const t = (new Date()).toISOString().split('T')[1];
            const t = (new Date().toLocaleTimeString())
            //const t = dt.toISOString().split('T')[1]
            setDisplayValue(convertUTCDateToLocalDate(new Date(value)));
        }
        else {
            setDisplayValue(null);
        }
    }, [value]);

    const valueChanged = (date) => {

        if (isReadonly()) {
            return;
        }

        if(disableFuture){
            if(new Date(date).getTime() > new Date().getTime()){
                return;
            }
        }
        try {

            if (ensureNonNullObject(date) !== true)
            {
                const evt = makeEvent(id, null);
                if (typeof onChange === 'function') {
                    onChange(evt);
                }
                if (typeof onBlur === 'function') {
                    onBlur(evt);
                }
                return;
            }
            
            const thisYear = (new Date()).getFullYear();
            const dateNum = Date.parse(date);
            const dateObj = (new Date(dateNum));
            const targetYear = dateObj.getFullYear();
            const t = (new Date()).toISOString().split('T')[1];

            if (!isNaN(dateNum) && (targetYear <= (thisYear + 100) && targetYear > 1921)) {
                //setShrink(ensureNonNullObject(date));
                const evt = makeEvent(id, new Date(`${dateObj.getFullYear()}-${addLeadingZero(dateObj.getMonth() + 1)}-${addLeadingZero(dateObj.getDate())}T${t}`));

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


    return <div className={classes.datePicker}><DesktopDatePicker
        id={id}
        name={id}
        label={label}
        value={displayValue}
        onChange={valueChanged}
        closeOnSelect={true}
        clearable={true}
        format="MM/dd/yyyy"
        {...rest}
        readOnly={isReadonly()}
        orientation="landscape"
        slotProps={{
            textField: {
                id:id,
                readOnly: disableFuture,
                size: 'small'
            },
        }}

        componentsProps={{
            textField: {
                variant: 'outlined', error, fullWidth: true, size: "small", sx: { width: '100%' }, contentWrapper: {
                    "& .MuiInputBase-root": {
                        padding: 0,
                        "& .MuiButtonBase-root": {
                            padding: 0,
                            paddingLeft: 10
                        },
                        "& .MuiInputBase-input": {
                            padding: 15,
                            paddingLeft: 0
                        }
                    }
                }
            }
        }}
    />
        {helperText ? <span className={classes.helperText}>{helperText}</span> : null}
    </div>;
}

export const DatePicker = DatePickerComponent;