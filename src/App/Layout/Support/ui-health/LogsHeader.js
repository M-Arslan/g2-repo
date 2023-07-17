import React from 'react';
import styled from 'styled-components';

const Container = styled.header`
    width: 100%;
    height: 100%;
    grid-column: 1/2;
    grid-row: 1;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    
    & > div {
        height: 75%;
        min-width: 100px;
    }
`;

export const LogHeader = () => {
    return (
        <Container>
        </Container>
    );
}