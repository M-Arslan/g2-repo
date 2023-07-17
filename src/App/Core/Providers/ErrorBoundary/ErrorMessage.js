import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    padding: 1em;
    background-color: rgba(215, 25, 25, 0.5);
`;

export const ErrorMessage = ({ message }) => {
    return <Container>{message}</Container>;
}