import React from 'react';
import styled from 'styled-components';
import {
    Attachment
} from '@mui/icons-material';
import {
    makeEvent
} from '../../Utility/makeEvent';

const Input = styled.label`
    
    & > input {
        display: none;
    }

    display: flex;
    flex-flow: row nowrap;
    align-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
`;

export const FileInput = ({ id, accept, onFileAdded }) => {

    const onChange = (evt) => {
        const e = makeEvent(id, evt.target.value);
        e.target.file = evt.target.files[0];

        if (typeof onFileAdded === 'function') {
            onFileAdded(e);
        }
    };

    return (
        <Input>
            <Attachment />
            <span>Attach File</span>
            <input type="file" id={id} onChange={onChange} accept={accept} />
        </Input>
    );
}