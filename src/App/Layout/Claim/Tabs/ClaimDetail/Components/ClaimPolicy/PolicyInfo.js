import React from 'react';
import {
    CircularProgress, IconButton
} from '@mui/material';
import {
    Search
} from '@mui/icons-material';
import {
    claimActivitySelectors
} from '../../../../../../Core/State/slices/claim-activity';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import {
    ensureNonEmptyString, ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    ContentRow,
    ContentCell,
    TextInput,
} from '../../../../../../Core/Forms/Common';
import {
    useGraphQL
} from '../../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    useNotifications
} from '../../../../../../Core/Providers/NotificationProvider/NotificationProvider';
import {
    GetPolicy
} from '../../Queries/GetPolicy';
import {
    GetWCPolicy
} from '../../Queries/GetWCPolicy';
import {
    safeObj, safeStr
} from '../../../../../../Core/Utility/safeObject';
import {
    genesisMLALossCodingActions,
    genesisMLALossCodingSelectors
} from '../../../../../../Core/State/slices/metadata/genesisMLALossCoding';

import { makeEvent } from '../../../../../../Core/Utility/makeEvent';
import { G2Date } from '../../../../../../Core/Utility/G2Date';
import { CLAIM_STATUS_TYPE } from '../../../../../../Core/Enumerations/app/claim-status-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../../Core/Enumerations/app/fal_claim-status-types';
import { CLAIM_TYPES, STAT_TYPES } from '../../../../../../Core/Enumerations/app/claim-type';
import { COMPANY_NAME } from '../../../../../../Core/Enumerations/app/company-name';
import { LEGAL_ENTITY } from '../../../../../../Core/Enumerations/app/legal-entity';

/**
 * @typedef {object} PolicyFormProps
 * @property {boolean} [readOnly=false]
 * @property {import('../../../../../../Core/Providers/FormProvider').Model} model
 */

/**
 *
 * @param {PolicyFormProps} props
 */

export const PolicyInfo = ({ model, readOnly }) => {
    const $notify = useNotifications();
    const $dispatch = useDispatch();

    const $api = useGraphQL({
        getPolicy: GetPolicy,
        getWCPolicy: GetWCPolicy
    });
    const [policyNumber, setPolicyNumber] = React.useState(safeStr(safeObj(model.claimPolicyID).value));
    const [policyData, setPolicyData] = React.useState(safeObj(safeObj(model.policy).value));
    const [searching, setSearching] = React.useState(false);
    const genesisMLALossCoding = useSelector(genesisMLALossCodingSelectors.selectData()) || {};
    const onPolicyNumberChanged = (evt) => {
        setPolicyNumber(evt.target.value);
    }

    const doSearch = async () => {
        var result = []
        if (model.claimType.value == CLAIM_TYPES.WORKERS_COMP && model.statutorySystem.value === STAT_TYPES.NATRE) {
             result = await $api.getWCPolicy({ id: policyNumber });
        }
        else {
              result = await $api.getPolicy({ id: policyNumber, g2LegalEntityID: model.g2LegalEntityID.value });
        }
        setSearching(false);

        setPolicyData(safeObj(result));
        if (ensureNonNullObject(result)) {

            model.handleUserInput(makeEvent('insuredName', '----'));
            model.handleUserInput(makeEvent('insuredNameContinuation', result?.insuredNameContinuation));
            model.handleUserInput(makeEvent('deptCD', result?.departmentCode));
            model.handleUserInput(makeEvent('uwDept', result?.departmentName));
            model.handleFinalizeInput(makeEvent('claimPolicyID', policyNumber));
            model.handleFinalizeInput(makeEvent('uwDept', result?.departmentName));
            model.handleFinalizeInput(makeEvent('effectiveDate', result?.effectiveDate));
            model.handleFinalizeInput(makeEvent('expirationDate', result?.expirationDate));
        }
        else {
            $notify.notifyError('Could not find the selected Policy Number in GenServe');
            model.handleUserInput(makeEvent('insuredName', '---'));
            model.handleUserInput(makeEvent('insuredNameContinuation', null));
            model.handleUserInput(makeEvent('deptCD', null));
            model.handleUserInput(makeEvent('uwDept', null));
            model.handleFinalizeInput(makeEvent('claimPolicyID', null));

        }
    //    if(ensureNonNullObject(result) && model.g2LegalEntityID.value === 3 && !model.statutorySystem.value)
    //    {
    //        $notify.notifyError('Please assign a statutory claim system and proceed');
    //    }
    }
    
    const searchForPolicy = () => {
        setSearching(true);
        doSearch();
    }
    React.useEffect(() => {
        $dispatch(genesisMLALossCodingActions.get({ boBCoverageID: (model.kindOfBusinessID.value ? model.kindOfBusinessID.value : ""), g2LegalEntityID: model.g2LegalEntityID.value }));
        //$dispatch(genesisMLALossCodingActions.get({ boBCoverageID: "37274", g2LegalEntityID: 3}));
    }, []);

    return (
        <>
            {(model.g2CompanyNameID.value === COMPANY_NAME.GIC_GENESIS_INSURANCE_COMPANY || model.g2CompanyNameID.value === COMPANY_NAME.GRC_GENERAL_REINSURANCE_CORPORATION) ?
                <>
                    <ContentRow>
                        <ContentCell>
                            <TextInput
                                label="Policy/Contract Number"
                                fullWidth={true}
                                value={policyNumber}
                                name="claimPolicyID"
                                onChange={onPolicyNumberChanged}
                                disabled={readOnly || searching}
                                variant="outlined"
                            />
                            <IconButton
                                onClick={searchForPolicy}
                                disabled={readOnly === true || ensureNonEmptyString(policyNumber) !== true || searching === true}
                            >
                                {
                                    searching === true ? <CircularProgress size={32} /> : <Search />
                                }
                            </IconButton>
                        </ContentCell>
                        <ContentCell>
                            <TextInput
                                label="Insured Location"
                                fullWidth={true}
                                value={`${policyData.insuredCity ? policyData.insuredCity : ''}${policyData.insuredCity && policyData.insuredState ? ', ' : ''}${policyData.insuredState ? policyData.insuredState : ''}`}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell>
                            <TextInput
                                label="Underwriter"
                                fullWidth={true}
                                value={policyData.underwriterID || ''}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell>
                            <TextInput
                                label="Effective Date"
                                fullWidth={true}
                                value={new G2Date(policyData.effectiveDate)}
                                inputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell>
                            <TextInput
                                label="Expiry Date"
                                fullWidth={true}
                                value={new G2Date(policyData.expirationDate)}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell>
                            <TextInput
                                label={model.g2LegalEntityID.value === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Attachment Point" : "Attachment"}
                                fullWidth={true}
                                value={genesisMLALossCoding.attachmentPoint}
                                inputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell>
                            <TextInput
                                label="Limit"
                                fullWidth={true}
                                value={genesisMLALossCoding.limit}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                        {model.g2CompanyNameID.value === COMPANY_NAME.GIC_GENESIS_INSURANCE_COMPANY ?
                            <ContentCell>
                                <TextInput
                                    label="Class Code"
                                    fullWidth={true}
                                    value={genesisMLALossCoding.coverage}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </ContentCell>
                            :
                            <ContentCell>
                                <TextInput
                                    label="Participation percent"
                                    fullWidth={true}
                                    value={genesisMLALossCoding.grcParticipation}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </ContentCell>
                        }
                    </ContentRow>
                    <ContentRow>
                        <ContentCell>
                            <TextInput
                                label="Attachment Method"
                                fullWidth={true}
                                value={genesisMLALossCoding.trigger}
                                inputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell>
                            <TextInput
                                label="ALAE Treatment"
                                fullWidth={true}
                                value={genesisMLALossCoding.expense}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell>
                            <TextInput
                                label={model.g2LegalEntityID.value === LEGAL_ENTITY.GENESIS_REINSURANCE ? "Coverage Code description" : "Coverage Code"}
                                fullWidth={true}
                                value={genesisMLALossCoding.coverage}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="99%">
                            <TextInput
                                label="Policy Comments"
                                name="policyComments"
                                fullWidth={true}
                                value={model.policyComments.value}
                                multiline
                                rows={3}
                                variant="outlined"
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                disabled={model.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.CLOSED || model.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.ERROR}
                                inputProps={{ maxLength: 1024 }}
                            />
                        </ContentCell>
                    </ContentRow>
                </>
                :
                <>
            <ContentRow>
                <ContentCell>
                    <TextInput
                        label="Policy Number"
                        fullWidth={true}
                        value={policyNumber}
                        name="claimPolicyID"
                        onChange={onPolicyNumberChanged}
                        disabled={readOnly || searching}
                        variant="outlined"
                    />
                    <IconButton
                        onClick={searchForPolicy}
                        disabled={readOnly === true || ensureNonEmptyString(policyNumber) !== true || searching === true}
                    >
                        {
                            searching === true ? <CircularProgress size={32} /> : <Search />
                        }
                    </IconButton>
                </ContentCell>
                        <ContentCell>
                    <TextInput
                        label="Policy Branch"
                        fullWidth={true}
                        value={policyData.policyBranch || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                    <TextInput
                        label="Insured Location"
                        fullWidth={true}
                        value={`${policyData.insuredCity ? policyData.insuredCity : ''}${policyData.insuredCity && policyData.insuredState ? ', ' : ''}${policyData.insuredState ? policyData.insuredState : ''}`}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell>
                    <TextInput
                        label="Underwriter"
                        fullWidth={true}
                        value={policyData.underwriterID || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                    <TextInput
                        label="Broker"
                        fullWidth={true}
                        value={policyData.clientBusinessName || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                    <TextInput
                        label="Broker Location"
                        fullWidth={true}
                        value={policyData.mailingCity || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell>
                    <TextInput
                        label="Effective Date"
                        fullWidth={true}
                        value={new G2Date(policyData.effectiveDate)}
                        inputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                    <TextInput
                        label="Expiry Date"
                        fullWidth={true}
                        value={new G2Date(policyData.expirationDate)}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                    <TextInput
                        label="Cancel Date"
                        fullWidth={true}
                        value={new G2Date(policyData.cancelDate)}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell>
                    <TextInput
                        label="Underwriting Department"
                        fullWidth={true}
                        value={policyData.departmentName || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                    <TextInput
                        label="Retro Date (if CM)"
                        fullWidth={true}
                        value={new G2Date(policyData.claimsMadeDate)}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                    />
                </ContentCell>
                <ContentCell>
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="99%">
                    <TextInput
                        label="Policy Comments"
                        name="policyComments"
                        fullWidth={true}
                        value={model.policyComments.value}
                        multiline
                        rows={3}
                        variant="outlined"
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                        disabled={model.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.CLOSED || model.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.ERROR}
                        inputProps={{ maxLength: 1024 }}
                    />
                </ContentCell>
                    </ContentRow>
                </>}
        </>
    );
}