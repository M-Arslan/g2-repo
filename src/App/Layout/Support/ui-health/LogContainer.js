import React from 'react';
import styled from 'styled-components';
import { LogGrid } from './LogGrid';
import { LogHeader } from './LogsHeader';
import { LogDetail } from './LogDetails';

const Container = styled.article`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 150px 1fr;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: transparent;
`;

export const LogContainer = () => {

    const [selectedLog, setSelectedLog] = React.useState(null);

    const selectLogDetail = (evt) => {
        setSelectedLog(evt.target.value);
    };

    return (
        <Container>
            <LogHeader />
            <LogGrid onSelect={selectLogDetail} />
            <LogDetail selected={selectedLog} />
        </Container>
    );

};