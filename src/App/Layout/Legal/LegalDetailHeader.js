import React from 'react';
import styled from 'styled-components';
import {
    SelectList,
    TextInput
} from '../../Core/Forms/Common';
import {
    MenuItem,
} from '@mui/material';
import {
    useNotifications
} from '../../Core/Providers/NotificationProvider/NotificationProvider';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString, ensureNonNullObject
} from '../../Core/Utility/rules';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    APP_TYPES
} from '../../Core/Enumerations/app/app-types';
import {
    claimActions,
    claimSelectors
} from '../../Core/State/slices/claim';
import {
    userSelectors
} from '../../Core/State/slices/user';
import {
    claimStatusTypeActions,
    claimStatusTypeSelectors
} from '../../Core/State/slices/metadata/claim-status-types';
import {
    safeArray,
    safeObj,
    safeStr
} from '../../Core/Utility/safeObject';
import {
    LegalClaimSelectors
} from '../../Core/State/slices/legal-claim';
import { LEGAL_ENTITY } from '../../Core/Enumerations/app/legal-entity';
import { CLAIM_TYPES } from '../../Core/Enumerations/app/claim-type';
import { financialDB2Actions, financialDB2Selectors, conferFinancialDB2Actions, conferFinancialDB2Selectors, fsriFinancialDB2Actions, fsriFinancialDB2Selectors } from '../../Core/State/slices/metadata/financial-db2';
import { claimDB2Actions, claimDB2Selectors } from '../../Core/State/slices/metadata/claim-db2';
import { loadPriorClaimActivity } from '../Claim/Tabs/Accounting/Queries/loadPriorClaimActivity';
import { ACCOUNTING_TRANS_TYPES } from '../../Core/Enumerations/app/accounting-trans-type';
import { STATUTORY_SYSTEM } from '../../Core/Enumerations/app/statutory-system';
import { FAL_CLAIM_STATUS_TYPES } from '../../Core/Enumerations/app/fal_claim-status-types';
import { GENSERVE_CLAIM_STATUS_TYPE } from '../../Core/Enumerations/app/claim-status-type';
const LegalInfoHeader = styled.section`
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

export const LegalDetailHeader = () => {

    const $notifications = useNotifications();

    const $dispatch = useDispatch();

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Claim_Detail);
    const claim = useSelector(claimSelectors.selectData());
    const legalClaim = useSelector(LegalClaimSelectors.selectData()) || {};
    let db2Claim = useSelector(claimDB2Selectors.selectData());
    db2Claim = (db2Claim || []).length > 0 ? db2Claim[0] : null;
    const fsriFinancialDB2 = useSelector(fsriFinancialDB2Selectors.selectData());
    const conferFinancialDB2 = useSelector(conferFinancialDB2Selectors.selectData());


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

        if (status === FAL_CLAIM_STATUS_TYPES.ASSIGNED && (ensureNonEmptyString(legalClaim.claimCounselUserID) !== true || legalClaim.claimCounselUserID === 'SVC_PAYLOAD')) {
            $notifications.notifyError('A claim cannot be marked as assigned without an assigned Claim Counsel.');
            console.warn('[ClaimDetail]: attempting to set status to assigned without Claim Counsel set', claim);
            return;
        }

        if (status === FAL_CLAIM_STATUS_TYPES.CLOSED && (ensureNonEmptyString(legalClaim.claimCounselUserID) !== true || legalClaim.claimCounselUserID === 'SVC_PAYLOAD')) {
            $notifications.notifyError('A claim cannot be marked as closed without an assigned Claim Counsel.');
            console.warn('[ClaimDetail]: attempting to set status to closed without Claim Counsel set', claim);
            return;
        }
        if (status === FAL_CLAIM_STATUS_TYPES.ERROR && (ensureNonEmptyString(legalClaim.claimCounselUserID) !== true || legalClaim.claimCounselUserID === 'SVC_PAYLOAD')) {
            $notifications.notifyError('A claim cannot be marked as error without an assigned Claim Counsel.');
            console.warn('[ClaimDetail]: attempting to set status to error without Claim Counsel set', claim);
            return;
        }

        if (status === FAL_CLAIM_STATUS_TYPES.CLOSED) {

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
        //    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STATUTORY_SYSTEM.FSRI) {

        //        if (fsriFinancialDB2?.lossStatus === "O") {
        //            if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
        //                $notifications.notifyError('This claim is Open in GenServe. Please first create a close request from the financials tab.');
        //                return;
        //            }
        //        }
        //        if (fsriFinancialDB2?.lossStatus === "P") {
        //            if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
        //                $notifications.notifyError('This claim is in Pending in GenServe. Please first request a close request in the financials tab.');
        //                return;
        //            }
        //        }
        //    }
        //    if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STATUTORY_SYSTEM.CONFER) {

        //        if (conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0].statusCode === GENSERVE_CLAIM_STATUS_TYPE.OPEN) {
        //            if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
        //                $notifications.notifyError('This claim is Open in GenServe. Please first create a close request from the financials tab.');
        //                return;
        //            }
        //        }
        //        if (conferFinancialDB2?.genReStatutoryDB2FinancialsCollection[0].statusCode === GENSERVE_CLAIM_STATUS_TYPE.PENDING) {
        //            if (activities.filter(X => X.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.CLOSE).length == 0) {
        //                $notifications.notifyError('This claim is in Pending in GenServe. Please first request a close request in the financials tab.');
        //                return;
        //            }
        //        }
        //    }
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
        return (item.statusText === 'New' || (item.statusText === 'Assigned' && claim.claimExaminerID === null && claim.claimCounselUserID === null));
    }
    return (
        <LegalInfoHeader>
            <ContentRow>
                <EndsCell>
                    <TextInput
                        label="Claim ID"
                        fullWidth
                        value={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ? safeStr(safeObj(claim).claimID) + (claim.statutoryClaimID ? "/" + claim.statutoryClaimID : "") : safeStr(safeObj(claim).claimID) }
                        variant="standard"
                        InputProps={{ readOnly: true }}
                    />
                </EndsCell>
                <InsuredNameCell>
                    {claim.claimType === CLAIM_TYPES.LEGAL ?
                        <TextInput
                            label="Insured Name"
                            variant="standard"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            value={(ensureNonNullObject(claim) ? (claim.insuredName ? claim.insuredName : "--") : "--")}
                        />
                        :
                        <TextInput
                            label="Insured Name"
                            variant="standard"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            value={(ensureNonNullObject(claim) ? (ensureNonNullObject(claim.policy) ? `${claim.policy.insuredName || ''} ${claim.policy.insuredNameContinuation || ''}`.trim() : (ensureNonNullObject(claim.claimPolicy) ? claim.claimPolicy.insuredName : '--')) : '--')}
                        />
                    }
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
        </LegalInfoHeader>
    );
}
