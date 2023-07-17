import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    litigationActions,
    litigationSelectors
} from '../../../../../Core/State/slices/litigation';
import {
    stripEmptyFields
} from '../../../../../Core/Utility/stripEmptyFields';
import {
    ensureNonNullObject
} from '../../../../../Core/Utility/rules';
import {
    useAppHost
} from '../../AppHost';
import {
    LitigationForm
} from './form';

export const LitigationTab = () => {

    const $host = useAppHost();
    const $dispatch = useDispatch();
    const litigation = useSelector(litigationSelectors.selectData());

    const initialRequest = (ensureNonNullObject(litigation) ? litigation : {
        claimMasterID: $host.claimMasterId
    });
    
    const doAutoSave = (evt) => {

        const { value } = evt.target;

        if (ensureNonNullObject(value) && value.valid === true && value.modified === true) {
            const data = stripEmptyFields({ ...value.request });
            $dispatch(litigationActions.shelf(data));
            $dispatch(litigationActions.save({ data }));
        }
    }

    return <LitigationForm
        id="litigation-form"
        onFinalize={doAutoSave}
        initialRequest={initialRequest}
        />;
};

