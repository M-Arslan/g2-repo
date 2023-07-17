import React from 'react';
import {
    Spinner
} from '../../../../Core/Forms/Common';
import {
    ClaimDetailTab
} from './Components/ClaimDetailTab';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    claimSelectors
} from '../../../../Core/State/slices/claim';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../Core/Utility/rules';
import {
    claimActivityActions,
    claimActivitySelectors
} from '../../../../Core/State/slices/claim-activity';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import {
    claimExaminerActions,
    claimExaminerSelectors,
    claimExaminerAllActions,
    claimExaminerAllSelectors
} from '../../../../Core/State/slices/metadata/claim-examiners';
import {
    riskStatesActions,
    riskStatesSelectors
} from '../../../../Core/State/slices/metadata/risk-states';
import {
    branchesActions,
    branchesSelectors
} from '../../../../Core/State/slices/metadata/branches';
import {
    companiesActions,
    companiesSelectors
} from '../../../../Core/State/slices/metadata/companies';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { AppHost, useAppHost } from '../AppHost';
import { BroadcastEvents, useBroadcaster } from '../../../../Core/Providers/BroadcastProvider';
import { CloudDownload } from '@mui/icons-material';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';

export const ClaimDetailApp = () => {

    const $host = useAppHost();
    const $dispatch = useDispatch();
    const $broadcaster = useBroadcaster();
    const claim = useSelector(claimSelectors.selectData());
    const activitiesStatus = useSelector(claimActivitySelectors.selectLoading());
    const claimExaminersStatus = useSelector(claimExaminerSelectors.selectLoading());
    const branchesStatus = useSelector(branchesSelectors.selectLoading());
    const companiesStatus = useSelector(companiesSelectors.selectLoading());
    const riskStatesStatus = useSelector(riskStatesSelectors.selectLoading());
    React.useEffect(() => {
        if (ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID)) {
            $dispatch(claimActivityActions.get({ claimMasterID: claim.claimMasterID }));
        }
    },[])
    React.useEffect(() => {
        if (claimExaminersStatus === ASYNC_STATES.IDLE) {
            $dispatch(claimExaminerActions.get());
        }

        if (branchesStatus === ASYNC_STATES.IDLE) {
            $dispatch(branchesActions.get());
        }

        if (companiesStatus === ASYNC_STATES.IDLE) {
            $dispatch(companiesActions.get());
        }

        if (riskStatesStatus === ASYNC_STATES.IDLE) {
            $dispatch(riskStatesActions.get());
        }

        const claimTypeLanguage = (ensureNonNullObject(claim) ? (claim.claimType === CLAIM_TYPES.CASUALTY ? 'Casualty' : 'Worker Comp') : '');
        $host.addMenuButtons({
            label: `Download ${claimTypeLanguage} Claim Extract`,
            icon: CloudDownload,
            handler: () => $broadcaster.publish(BroadcastEvents.RequestClaimExtract),
        });
    }, [claim.claimMasterID]);


    if ([activitiesStatus, riskStatesStatus, claimExaminersStatus, companiesStatus, branchesStatus].some(s => s !== ASYNC_STATES.SUCCESS)) {
        return <Spinner />;
    }
    else {
        return <ClaimDetailTab />;
    }
};

export default () => (
    <AppHost app={APP_TYPES.Claim_Detail}>
        <ClaimDetailApp />
    </AppHost>
);