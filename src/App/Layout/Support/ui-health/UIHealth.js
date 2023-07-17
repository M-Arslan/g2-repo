import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { Spinner } from '../../../Core/Forms/Common';
import { appLogsActions, appLogsSelectors } from '../../../Core/State/slices/app-logs';
import { LogContainer } from './LogContainer';


export const UIHealth = () => {

    const status = useSelector(appLogsSelectors.selectLoading());
    const $dispatch = useDispatch();

    React.useEffect(() => {
        if (status !== ASYNC_STATES.SUCCESS) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            $dispatch(appLogsActions.get({ start: now }));
        }
    });

    return (status === ASYNC_STATES.SUCCESS ? <LogContainer /> : <Spinner onPrimary={true} />);
}