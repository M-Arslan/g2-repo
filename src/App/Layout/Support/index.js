import React from 'react';
import {
    useSelector
} from 'react-redux';
import {
    configSelectors
} from '../../Core/State/slices/config';

export const SupportScreen = () => {

    const config = useSelector(configSelectors.selectData());

    return <div style={{ height: '100%' }}>
        <iframe src={config.supportUrl} width="100%" height="100%" title="Admin Forms"></iframe>
    </div>;
}