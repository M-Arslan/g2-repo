import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    ASYNC_STATES
} from '../Core/Enumerations/redux/async-states';
import {
    useNotifications
} from '../Core/Providers/NotificationProvider/NotificationProvider';
import {
    clearAppStatus,
    selectAppStatus
} from '../Core/State';
import {
    ensureNonEmptyString
} from '../Core/Utility/rules';
import {
    safeObj
} from '../Core/Utility/safeObject';

export const StatusNotifier = () => {

    const $notifications = useNotifications();
    const $dispatch = useDispatch();

    const currentStatus = useSelector(selectAppStatus);

    React.useEffect(() => {

        const { status = ASYNC_STATES.IDLE, message = null } = safeObj(currentStatus);

        if (ensureNonEmptyString(message) && [ASYNC_STATES.ERROR, ASYNC_STATES.SUCCESS].includes(status)) {
            if (status === ASYNC_STATES.ERROR) {
                $notifications.notifyError(message);
            }
            else if (status === ASYNC_STATES.SUCCESS) {
                $notifications.notifySuccess(message);
            }

            $dispatch(clearAppStatus());
        }

    }, [currentStatus]);

    return <></>;

};