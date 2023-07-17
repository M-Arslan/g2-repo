import React from 'react';
import {
    useSelector
} from 'react-redux';
import {
    configSelectors
} from '../../Core/State/slices/config';

export const AdminScreen = () => {

    /** @type {import('../../../types.d').AppConfig} */
    const config = useSelector(configSelectors.selectData());

    return <div style={{ height: '100%' }}>
        <iframe src={config.adminUrl} width="100%" height="100%" title="Admin Forms"></iframe>
    </div>;
}