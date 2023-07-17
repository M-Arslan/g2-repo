import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { claimSelectors } from '../../../../Core/State/slices/claim';
import { ClaimantListActions } from '../../../../Core/State/slices/claimant';
import { AppHost } from '../AppHost';
import { ClaimantTab } from './components/ClaimantTab';

export default () => {

    const claim = useSelector(claimSelectors.selectData());
    const $dispatch = useDispatch();

    React.useEffect(() => {
        $dispatch(ClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
    }, []);

    return (
        <AppHost app={APP_TYPES.Claimant}>
            <ClaimantTab />
        </AppHost>
    );
};