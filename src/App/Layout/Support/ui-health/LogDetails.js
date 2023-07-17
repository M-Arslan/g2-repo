import React from 'react';
import styled from 'styled-components';
import { safeObj } from '../../../Core/Utility/safeObject';

const Container = styled.aside`
    height: 100%;
    width: 100%;
    padding: 1em;
    border-radius: 4px;
    background-color: #fff;
    grid-column: 2;
    grid-row: 2;
    overflow: auto;
`;

export const LogDetail = ({ selected }) => {
    return (
        <Container>
            <pre>
                {JSON.stringify(safeObj(selected), null, 4)}
            </pre>
        </Container>
    );
}