import React from 'react';
import styled from 'styled-components';
import {
    InputHighlighter
} from './Animations';

const Group = styled.div`
    position: relative; 
    margin-bottom: 45px; 
`;

const Input = styled.input`
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 300px;
    border: none;
    border-bottom: 1px solid ${props => props.theme.primaryColor};

    &:focus {
        outline: none;
    }

    &:focus ~ label, &:valid ~ label {
        top: -20px;
        font-size: 14px;
        color: ${props => props.theme.primaryColor};
    }

    &:focus ~ ${Bar}:before, &:focus ~ ${Bar}:after {
        width:50%;
    }

    &:focus ~ ${Highlight} {
        animation: ${InputHighlighter} 0.3s ease;
    }

`;

const Label = styled.label`
    color: ${props => props.theme.onBackground}; 
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 10px;
    transition: 0.2s ease all;
`;

const Bar = styled.span`
    position: relative; 
    display: block; 
    width: 300px;

    &:before, &:after {
        content: '';
        height: 2px; 
        width: 0;
        bottom: 1px; 
        position: absolute;
        background: ${props => props.theme.primaryColor}; 
        transition: 0.2s ease all; 
    }

    &:before {
        left: 50%;
    }

    &:after {
        right: 50%; 
    }
`;

const Highlight = styled.span`
    position: absolute;
    height: 60%; 
    width: 100px; 
    top: 25%; 
    left: 0;
    pointer-events: none;
    opacity: 0.5;
`;

export const InputField = ({ type, required, value, children }) => {
    return (
        <Group>
            <Input type={type} required={required} value={value} />
            <Highlight />
            <Bar />
            <Label>{children}</Label>
        </Group>
    );
};