import React from 'react';
import styled from 'styled-components';
import { ensureNonEmptyString } from '../../../../../../../Core/Utility/rules';

const DocContainer = styled.article`
    height: 100%;
    min-height: 400px;
    width: 100%;
    overflow: auto;
    padding: 0;
    margin: 0;
    border: 0;
`;

export const DocPreview = ({ document }) => {
    if (ensureNonEmptyString(document) !== true) {
        return <DocContainer><h5>Document preview unavailable</h5></DocContainer>;
    }

    return <object data={`data:application/pdf;base64,${document}`} type="application/pdf" height="100%" width="100%" title="Document Preview"></object>;
}