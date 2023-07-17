import React from 'react';
import styled from 'styled-components';
import {
    Checkbox as MUICheckbox
} from '@mui/material';
import {
    makeEvent
} from '../../Utility/makeEvent';

const CheckboxLabel = styled.label`
    display: flex;
    flex-flow: row nowrap;
    align-content: center;
    align-items: center;
    width: ${props => (props.width || '100%')};

    & > span {
        padding-left: .5em;
    }
`;

export const Checkbox = ({ id, onChange, onBlur, value, checkedValue, uncheckedValue, label, width = '100%' }) => {

    const checkChanged = (evt) => {

        const isChecked = (evt.target.checked === true);
        const e = makeEvent(id, (isChecked ? checkedValue : uncheckedValue));

        if (typeof onChange === 'function') {
            onChange(e);
        }

        if (typeof onBlur === 'function') {
            onBlur(e);
        }
    }

    return (
        <CheckboxLabel htmlFor={id} width={width}>
            <MUICheckbox id={id} name={id} onChange={checkChanged} checked={(value === checkedValue)} />
            <span>{label}</span>
        </CheckboxLabel>
    );
}