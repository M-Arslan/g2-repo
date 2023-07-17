import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import {
    Spinner
} from '../../../../Core/Forms/Common';
import {
    claimSelectors
} from '../../../../Core/State/slices/claim';
import {
    litigationActions,
    litigationSelectors
} from '../../../../Core/State/slices/litigation';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../Core/Utility/rules';
import { AppHost } from '../AppHost';
import {
    LitigationTab
} from './Components/LitigationTab';


export const LitigationApp = () => {

    const $dispatch = useDispatch();
    const claim = useSelector(claimSelectors.selectData());
    const loading = useSelector(litigationSelectors.selectLoading());
    const litigation = useSelector(litigationSelectors.selectData());
    
    React.useEffect(() => {
        if (ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID)) {
            $dispatch(litigationActions.get({ claimMasterId: claim.claimMasterID }));
        }
    }, [claim.claimMasterID]);

    return (loading === ASYNC_STATES.WORKING && ensureNonNullObject(litigation) !== true  ? <Spinner /> : <LitigationTab />);
};

export default () => (
    <AppHost app={APP_TYPES.Litigation}>
        <LitigationApp />
    </AppHost>
);