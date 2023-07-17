import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    ASYNC_STATES
} from '../Core/Enumerations/redux/async-states';
import {
    Spinner
} from '../Core/Forms/Common';
import {
    configActions
} from '../Core/State/slices/config';
import {
    userActions,
    userSelectors
} from '../Core/State/slices/user';
import {
    Layout
} from './Layout';
import {
    Unauthorized
} from './Unauthorized';

export const AppLayout = () => {
    const $dispatch = useDispatch();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const loadStatus = useSelector(userSelectors.selectLoading());
    //const data = useSelector(usersSelectors.selectData());

    React.useEffect(() => {
        //$dispatch(usersActions.getAllUsers());
        $dispatch(userActions.get());
        $dispatch(configActions.get());
    }, []);

    if (loadStatus === ASYNC_STATES.SUCCESS && $auth.isAuthorized === false) {
        return <Unauthorized />;
    }
    else if (loadStatus === ASYNC_STATES.SUCCESS && $auth.isAuthorized === true) {
        return <Layout />;
    }
    else {
        return <Spinner onPrimary={true} />
    }
}