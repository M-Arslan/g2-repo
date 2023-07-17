import React from 'react';
import styled from 'styled-components';
import { MenuItem, ListItemText, Checkbox } from '@mui/material';
import { makeEvent } from '../../Utility/makeEvent';
import { ensureIsNumber, ensureNonEmptyArray, ensureNonEmptyString, ensureNonNullObject } from '../../Utility/rules';
import { safeArray, safeObj } from '../../Utility/safeObject';
import { SelectList } from './SelectList';

const ListItem = styled(MenuItem)`
    display: flex;
    flex-flow: row nowrap;
    align-content: center;
    align-items: center;
`;

export const ArrayDropdown = ({ id, label, list, valueProp, displayProp, value, required = false, multiple = false, onChange, onBlur, ...rest }) => {

    const fl = safeArray(list).filter(i => ensureNonNullObject(i) || ensureNonEmptyString(i) || ensureIsNumber(i))
        .map(x => {
            if (typeof x === 'object') {
                const value = (ensureNonEmptyString(valueProp) ? safeObj(x)[valueProp] : '');
                const label = (ensureNonEmptyString(displayProp) ? safeObj(x)[displayProp] : '');
                return { value, label };
            }
            else {
                return { value: `${x}`, label: `${x}` };
            }
        });

    const [selectedItems, setSelectedItems] = React.useState((multiple === true ? [] : ''));

    React.useEffect(() => {
        if (multiple === true && typeof value === 'string') {
            const arrValues = (value.split(';').filter(v => fl.some(i => i.value === v)));
            const arrValue = [...(new Set(arrValues))];

            setSelectedItems(arrValue);
        }
        else {
            setSelectedItems((multiple === true && ensureNonEmptyArray(value) === false ? [] : value));
        }
    }, [value]);

    const handleChange = (evt) => {
        const { value } = evt.target;

        if (typeof value === 'string' && multiple === true) {
            const arrValues = (value.split(';').filter(v => fl.some(i => i.value === v)));
            const arrValue = [...(new Set(arrValues))];
            setSelectedItems(arrValue);
        }
        else if (ensureNonEmptyArray(value)) {
            const setValue = [...(new Set(value))];
            setSelectedItems(setValue);
        }
        else {
            setSelectedItems(value);
        }

        if (typeof onChange === 'function') {
            const val = (Array.isArray(value) ? (value.filter(i => i !== null && i !== '').join(';')) : value);
            onChange(makeEvent(id, val));
        }
    }

    const handleBlur = (evt) => {
        const { value } = evt.target;

        if (typeof onBlur === 'function') {
            const val = (Array.isArray(value) ? (value.filter(i => i !== null && i !== '').join(';')) : value);
            onBlur(makeEvent(id, val));
        }
    }
    
    return <SelectList
        id={id}
        name={id}
        label={label}
        fullWidth={true}
        allowempty={required !== true}
        variant="outlined"
        required={required === true}
        multiple={multiple === true}
        value={selectedItems}
        renderValue={(selected) => ensureNonEmptyArray(selected) ? selected.filter(i => ensureNonEmptyString(i)).join(';') : selected}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
    >
        {fl.map((i, idx) => (
            <ListItem key={`${id}-item-${idx}`} value={i.value}>
                {multiple === true ? <Checkbox checked={selectedItems.indexOf(i.value) > -1} /> : null}
                <ListItemText primary={i.label} />
            </ListItem>
        ))}
    </SelectList>;
}