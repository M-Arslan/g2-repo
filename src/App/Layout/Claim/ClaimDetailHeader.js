import {
    MenuItem
} from '@mui/material';
import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import styled from 'styled-components';
import {
    APP_TYPES
} from '../../Core/Enumerations/app/app-types';
import { LEGAL_ENTITY } from '../../Core/Enumerations/app/legal-entity';
import {
    SelectList,
    TextInput
} from '../../Core/Forms/Common';
import {
    useNotifications
} from '../../Core/Providers/NotificationProvider/NotificationProvider';
import {
    claimActions,
    claimSelectors
} from '../../Core/State/slices/claim';
import { claimDB2Actions, claimDB2Selectors } from '../../Core/State/slices/metadata/claim-db2';
import {
    claimStatusTypeActions,
    claimStatusTypeSelectors
} from '../../Core/State/slices/metadata/claim-status-types';
import { conferFinancialDB2Actions, conferFinancialDB2Selectors, fsriFinancialDB2Actions, fsriFinancialDB2Selectors } from '../../Core/State/slices/metadata/financial-db2';
import {
    userSelectors
} from '../../Core/State/slices/user';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString, ensureNonNullObject
} from '../../Core/Utility/rules';
import {
    safeArray,
    safeObj,
    safeStr
} from '../../Core/Utility/safeObject';
import { createActionLogForFALStatusChangeAssigned, createActionLogForFALStatusChangeClosed, createActionLogForFALStatusChangeNew } from '../ActionLog/Queries';
import { loadPriorClaimActivity } from './Tabs/Accounting/Queries/loadPriorClaimActivity';
import {
    loadClaimants
} from './Tabs/Claimants/queries';
import { ACCOUNTING_TRANS_TYPES } from '../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_TYPES } from '../../Core/Enumerations/app/claim-type';
import { STATUTORY_SYSTEM } from '../../Core/Enumerations/app/statutory-system';
import { FAL_CLAIM_STATUS_TYPES } from '../../Core/Enumerations/app/fal_claim-status-types';
import { GENSERVE_CLAIM_STATUS_TYPE } from '../../Core/Enumerations/app/claim-status-type';



const ClaimInfoHeader = styled.section`
    width: 100%;
    overflow: visible;
    padding: .5em;
    margin: 0;
    border: none;
`;

const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

const ContentCell = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: .5em;
`;

const EndsCell = styled(ContentCell)`
    width: 25%;
`;

const InsuredNameCell = styled(ContentCell)`
    width: 50%;
`;

export const ClaimDetailHeader = () => {

    const $notifications = useNotifications();

    const $dispatch = useDispatch();

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Claim_Detail);
    const claim = useSelector(claimSelectors.selectData());
    let db2Claim = useSelector(claimDB2Selectors.selectData());
    db2Claim = (db2Claim || []).length > 0 ? db2Claim[0] : null;
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());

    const [activities, setActivitiesState] = React.useState([]);


    /** @type {Array<import('../../../types.d').ClaimStatusType>} */
    const statusTypes = useSelector(claimStatusTypeSelectors.selectData());

    /**
     * Save changes to the claim
     * @param {import('../../Core/State/slices/claim/types.d').ClaimMaster} claim
     */
    const doAutoSave = async (claim) => {
        $dispatch(claimActions.save({ claim }));
    };
    const onFalStatusChanged = async (evt) => {
        const status = evt.target.value;
        if (status === FAL_CLAIM_STATUS_TYPES.CLOSED) {
            let result = await loadClaimants(claim.claimMasterID);
            let flag = (ensureNonEmptyArray(result?.data?.claimants) ? result.data.claimants.every(c => {
                return (!c.medicareEligible || (c.medicareEligible && (c.medicare?.reportToCMS || c.medicare?.cMSRejected)) || c.medicare?.reportingToCMSNotRequired);
            }) : true);

            //if (result?.data?.claimants) {
            //    result.data.claimants.filter((x) => {
            //        if (x.medicareEligible && (x.medicare?.reportedToCMS || x?.medicare?.cMSRejected)) {
            //            flag = true;
            //        }
            //    })
            //}
            if (!flag) {
                $notifications.notifyError('You may not close this claim because there is at least one claimant that are marked as “Medicare Eligible” but have not yet in the status "Report to CMS"');
                return;
            }
        }
        if (status === FAL_CLAIM_STATUS_TYPES.ASSIGNED && (ensureNonEmptyString(claim.claimExaminerID) !== true || claim.claimExaminerID === 'SVC_PAYLOAD')) {
            $notifications.notifyError('A claim cannot be marked as assigned without an assigned Claim Examiner.');
            console.warn('[ClaimDetail]: attempting to set status to assigned without Examiner set', claim);
            return;
        }
        if (status === FAL_CLAIM_STATUS_TYPES.CLOSED && (ensureNonEmptyString(claim.claimExaminerID) !== true || claim.claimExaminerID === 'SVC_PAYLOAD')) {
            $notifications.notifyError('A claim cannot be marked as closed without an assigned Claim Examiner.');
            console.warn('[ClaimDetail]: attempting to set status to closed without Examiner set', claim);
            return;
        }
        if (status === FAL_CLAIM_STATUS_TYPES.ERROR && (ensureNonEmptyString(claim.claimExaminerID) !== true || claim.claimExaminerID === 'SVC_PAYLOAD')) {
            $notifications.notifyError('A claim cannot be marked as error without an assigned Claim Examiner.');
            console.warn('[ClaimDetail]: attempting to set status to error without Examiner set', claim);
            return;
        }
        if (status === FAL_CLAIM_STATUS_TYPES.NEW) {
            createActionLogForFALStatusChangeNew(claim.claimMasterID);
        }
        else if (status === FAL_CLAIM_STATUS_TYPES.ASSIGNED) {
            createActionLogForFALStatusChangeAssigned(claim.claimMasterID);
        }
        else if (status === FAL_CLAIM_STATUS_TYPES.CLOSED) {

            const activitiesData = await loadPriorClaimActivity(claim.claimMasterID);
            const activities = activitiesData.data.accountingList || [];
            if (claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR) {
                if (db2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
                    if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
                        $notifications.notifyError('This claim is Open in GenServe. Please first create a close request from the financials tab.');
                        return;
                    }
                }
                if (db2Claim?.statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING) {
                    if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
                        $notifications.notifyError('This claim is in Pending in GenServe. Please first request a close request in the financials tab.');
                        return;
                    }
                }
            }
            //if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STATUTORY_SYSTEM.FSRI) {
                
            //    if (fsriFinancialDB2?.lossStatus === "O") {
            //        if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
            //            $notifications.notifyError('This claim is Open in GenServe. Please first create a close request from the financials tab.');
            //            return;
            //        }
            //    }
            //    if (fsriFinancialDB2?.lossStatus === "P") {
            //        if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
            //            $notifications.notifyError('This claim is in Pending in GenServe. Please first request a close request in the financials tab.');
            //            return;
            //        }
            //    }
            //}
            //if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STATUTORY_SYSTEM.CONFER) {
                
            //    if (conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0].statusCode  === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
            //        if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
            //            $notifications.notifyError('This claim is Open in GenServe. Please first create a close request from the financials tab.');
            //            return;
            //        }
            //    }
            //    if (conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0].statusCode  === GENSERVE_CLAIM_STATUS_TYPE.PENDING) {
            //        if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
            //            $notifications.notifyError('This claim is in Pending in GenServe. Please first request a close request in the financials tab.');
            //            return;
            //        }
            //    }
            //}


            createActionLogForFALStatusChangeClosed(claim.claimMasterID);
        }

        doAutoSave({ ...claim, fALClaimStatusTypeID: status });
    }

    React.useEffect(() => {
        if (ensureNonEmptyArray(statusTypes) !== true) {
            $dispatch(claimStatusTypeActions.get());
        }
    }, []);
    React.useEffect(() => {
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR || claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE) {
            $dispatch(claimDB2Actions.get({ filterType: "C", filterValue: claim.claimID, g2LegalEntityID: claim.g2LegalEntityID, includeLegal: claim.claimType === CLAIM_TYPES.LEGAL }));
        }
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STATUTORY_SYSTEM.FSRI) {
            $dispatch(fsriFinancialDB2Actions.get({ statutoryClaimID: claim.statutoryClaimID, statutorySystem: STATUTORY_SYSTEM.FSRI, g2LegalEntityID: claim.g2LegalEntityID }));
        }
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STATUTORY_SYSTEM.CONFER) {
            $dispatch(conferFinancialDB2Actions.get({ statutoryClaimID: claim.statutoryClaimID, statutorySystem: STATUTORY_SYSTEM.CONFER, g2LegalEntityID: claim.g2LegalEntityID }));
        }
    }, [claim.g2LegalEntityID]);

    const isItemDisabled = (item) => {
        return (item.statusText === 'New' || (item.statusText === 'Assigned' && claim.claimExaminerID === null));
    }

    return (
        <ClaimInfoHeader>
            <ContentRow>
                <EndsCell>
                    <TextInput
                        label="Claim ID"
                        fullWidth
                        value={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? safeStr(safeObj(claim).claimID) + (claim.statutoryClaimID ? "/" + claim.statutoryClaimID : "") : safeStr(safeObj(claim).claimID)}
                        variant="standard"
                        InputProps={{ readOnly: true }}
                    />
                </EndsCell>
                <InsuredNameCell>
                    <TextInput
                        label="Insured Name"
                        variant="standard"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={(ensureNonNullObject(claim) ? (ensureNonNullObject(claim.policy) ? `${claim.policy.insuredName || ''} ${claim.policy.insuredNameContinuation || ''}`.trim() : (ensureNonNullObject(claim.claimPolicy) ? claim.claimPolicy.insuredName || '' : claim.insuredName)) : '--')}
                    />
                </InsuredNameCell>
                <EndsCell>
                    <SelectList
                        id="fALClaimStatusTypeID"
                        name="fALClaimStatusTypeID"
                        label="FAL Claim Status"
                        fullWidth={true}
                        value={claim.fALClaimStatusTypeID || FAL_CLAIM_STATUS_TYPES.NEW}
                        onChange={onFalStatusChanged}
                        variant="standard"
                        inputProps={{ readOnly: (isViewer === true) }}
                        allowempty={false}
                    >
                        {
                            safeArray(statusTypes)
                                .map((item, idx) => <MenuItem value={item.claimStatusTypeID} key={`fal-option-${idx}`} disabled={isItemDisabled(item)}>{item.statusText}</MenuItem>)
                        }
                    </SelectList>
                </EndsCell>
            </ContentRow>
        </ClaimInfoHeader>
    );
}
