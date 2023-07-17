import React from 'react';
import {
    AppHost,
    useAppHost
} from '../AppHost';
import {
    PostAdd
} from '@mui/icons-material';
import {
    useBroadcaster,
    BroadcastEvents
} from '../../../../Core/Providers/BroadcastProvider';
import {
    AssociatedClaimsTab
} from './Components/AssociatedClaimsTab';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { claimSelectors } from '../../../../Core/State/slices/claim';
import { assocClaimsActions, assocClaimsSelectors } from '../../../../Core/State/slices/assoc-claims';
import { ASYNC_STATES } from '../../../../Core/Enumerations/redux/async-states';
import { Spinner } from '../../../../Core/Forms/Common';
import { useDispatch, useSelector } from 'react-redux';
import { ensureNonEmptyString, ensureNonNullObject } from '../../../../Core/Utility/rules';

/**
 * AssociatedClaimApp - application level component for the Associated Claims tab on Claim Detail
 * @constructor
 * */
export const AssociatedClaimApp = () => {

    const $host = useAppHost();
    const $broadcaster = useBroadcaster();
    const $dispatch = useDispatch();
    const claim = useSelector(claimSelectors.selectData());
    const loadStatus = useSelector(assocClaimsSelectors.selectLoading());


    React.useEffect(() => {
        loadAsssociatedClaimsData();
    }, [claim.claimMasterID]);

    const loadAsssociatedClaimsData = () => {
        if (ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID)) {
            $dispatch(assocClaimsActions.get({ claimMasterId: claim.claimMasterID, g2LegalEntityID: claim.g2LegalEntityID, statSystem: claim.statutorySystem }));
        }
    }

    React.useEffect(() => {
        $host.addToolButtons([{
            label: 'Associate New Claims',
            icon: PostAdd,
            handler: () => $broadcaster.publish(BroadcastEvents.RequestAssocClaimDrawerOpen),
            disabled: (ctx) => ctx.appIsReadonly === true,
        }]);
    }, []);

    return (loadStatus === ASYNC_STATES.SUCCESS ? <AssociatedClaimsTab loadAsssociatedClaims={loadAsssociatedClaimsData} claim={claim} /> : <Spinner />);
};

export default () => (
    <AppHost app={APP_TYPES.Assoc_Claims}>
        <AssociatedClaimApp />
    </AppHost>
);