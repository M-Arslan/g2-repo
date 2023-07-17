import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { claimSelectors } from '../../../../Core/State/slices/claim'
import { AppHost } from '../../../../Layout/Claim/Tabs/AppHost';
import { ReimbursementApp } from './Components/ReimbursementApp';

export default () => {

    //const claim = useSelector(claimSelectors.selectData());
    //const $dispatch = useDispatch();

    //React.useEffect(() => {
    //    $dispatch(WCClaimantListActions.list({ claimMasterID: claim.claimMasterID }));
    //}, []);

    return (
        <AppHost app={APP_TYPES.Reimbursement}>
            <ReimbursementApp />
        </AppHost>
    );
};