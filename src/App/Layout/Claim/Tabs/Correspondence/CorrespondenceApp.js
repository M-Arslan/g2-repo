import React from 'react';
import {
    AppHost,
    useAppHost
} from '../AppHost';
import {
    CorrespondenceTab,
} from './Components/CorrespondenceTab';
import {
    Email,
} from '@mui/icons-material';
import {
    BroadcastEvents,
    useBroadcaster
} from '../../../../Core/Providers/BroadcastProvider';
import { useDispatch, useSelector } from 'react-redux';
import { riskStatesSelectors, riskStatesActions } from '../../../../Core/State/slices/metadata/risk-states';
import { contactsSelectors, contactsActions } from '../../../../Core/State/slices/contact';
import { ASYNC_STATES } from '../../../../Core/Enumerations/redux/async-states';
import { Spinner } from '../../../../Core/Forms/Common';
import { ensureNonEmptyString, ensureNonNullObject } from '../../../../Core/Utility/rules';
import { templateTextActions, templateTextSelectors } from '../../../../Core/State/slices/metadata/template-text';
import { associatedPolicyContractActions, associatedPolicyContractSelectors } from '../../../../Core/State/slices/associated-policy-contracts';
import { propertyPolicyActions, propertyPolicySelectors } from '../../../../Core/State/slices/property-policy';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';


/**
 * @typedef {object} CorrespondenceApi
 * @property {Function} load - loads the correspondence list
 * @property {Function} remove - deletes a correspondence from the list
 */

/**
 * CorrespondenceApp - application level component for the Contacts tab on Claim Detail
 * @constructor
 * */
export const CorrespondenceApp = () => {
    const $host = useAppHost();
    const $broadcaster = useBroadcaster();
    const $dispatch = useDispatch();
    const riskStatesStatus = useSelector(riskStatesSelectors.selectLoading());
    const contactsLoaded = useSelector(contactsSelectors.selectLoading());
    const templatesLoaded = useSelector(templateTextSelectors.selectLoading());
    const assocPoliciesLoaded = useSelector(associatedPolicyContractSelectors.selectLoading());
    const propPolicyLoaded = useSelector(propertyPolicySelectors.selectLoading());


    // -- configure the "add new" drawer
    React.useEffect(() => {
        $host.addToolButtons([{
            label: 'New Correspondence',
            icon: Email,
            handler: () => {
                $broadcaster.publish(BroadcastEvents.RequestNewCorrespondence, {});
            },
            disabled: (ctx) => ctx.appIsReadonly === true,
        }]);

        if (riskStatesStatus === ASYNC_STATES.IDLE) {
            $dispatch(riskStatesActions.get());
        }

        if (templatesLoaded === ASYNC_STATES.IDLE) {
            $dispatch(templateTextActions.get());
        }

        const claim = $host.claim;
        if (contactsLoaded === ASYNC_STATES.IDLE && ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID)) {
            $dispatch(contactsActions.get({ claimMasterId: claim.claimMasterID }));
        }

        if (assocPoliciesLoaded === ASYNC_STATES.IDLE && ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID)) {
            $dispatch(associatedPolicyContractActions.getList({ claimMasterID: claim.claimMasterID, onlyLoadPrimary: true }));
        }

        if (propPolicyLoaded === ASYNC_STATES.IDLE && ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID)) {
            $dispatch(propertyPolicyActions.get({ claimMasterID: claim.claimMasterID }));
        }

    }, []);

    const isLoaded = [riskStatesStatus, contactsLoaded, templatesLoaded, assocPoliciesLoaded, propPolicyLoaded].every(s => s === ASYNC_STATES.SUCCESS);
    return (isLoaded !== true ? <Spinner /> : <CorrespondenceTab context={{ claimMasterId: $host.claimMasterId }} />);
};

export default () => (
    <AppHost app={APP_TYPES.Correspondence}>
        <CorrespondenceApp />
    </AppHost>
);