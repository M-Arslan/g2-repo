import React from 'react';
import {
    ContentRow,
    ContentCell,
    TextInput,
    DatePicker,
    Spinner
} from '../../../../../../Core/Forms/Common';
import {
    asForm,
    DateRules,
    ModelRule,
    Schema,
    Pattern,
    Required,
    MaxLength,
} from '../../../../../../Core/Providers/FormProvider';
import {
    ensureNonEmptyString
} from '../../../../../../Core/Utility/rules';
import { useSelector } from 'react-redux';
import { claimSelectors } from '../../../../../../Core/State/slices/claim';
import {
    claimActivitySelectors
} from '../../../../../../Core/State/slices/claim-activity';
import { CLAIM_STATUS_TYPE } from '../../../../../../Core/Enumerations/app/claim-status-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../../Core/Enumerations/app/fal_claim-status-types';

/**
* @typedef {object} ManualPolicyFormProps
* @property {boolean} [readOnly=false]
* @property {import('../../../../../../Core/Providers/FormProvider').Model} model
*/

/**
*
* @param {ManualPolicyFormProps} props
*/
const ManualPolicyInfoForm = ({ model, readOnly = false, claimModel }) => {
    const claim = useSelector(claimSelectors.selectData());
    const loading = useSelector(claimSelectors.selectLoading());    
    return (
        <>
            {
                (loading === 'working') && claim?.claimPolicy?.claimPolicyID === null ?
                    <Spinner />
                    :
                    <>
                        <ContentRow>
                            <ContentCell>
                                <TextInput
                                    label="Policy Number"
                                    fullWidth={true}
                                    value={model.policyID.value}
                                    name="policyID"
                                    onChange={model.handleUserInput}
                                    disabled={readOnly === true}
                                    variant="outlined"
                                    onBlur={model.handleFinalizeInput}
                                    error={model.policyID.showError}
                                    helperText={model.policyID.error}
                                    inputProps={{ maxLength: 10 }}
                                    required
                                />
                            </ContentCell>

                            <ContentCell>
                                <TextInput
                                    label="Insured Name"
                                    name="insuredName"
                                    disabled={ensureNonEmptyString(model.policyID.value) !== true}
                                    value={model.insuredName.value}
                                    variant="outlined"
                                    onChange={model.handleUserInput}
                                    onBlur={model.handleFinalizeInput}
                                    inputProps={{ readOnly: readOnly === true, maxLength: 100 }}
                                />
                            </ContentCell>
                            <ContentCell>
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell>
                                <DatePicker
                                    id="polEffDate"
                                    name="polEffDate"
                                    label="Effective Date"
                                    disabled={ensureNonEmptyString(model.policyID.value) !== true}
                                    value={model.polEffDate.value}
                                    fullWidth={true}
                                    onChange={model.handleUserInput}
                                    onBlur={model.handleFinalizeInput}
                                    variant="outlined"
                                    inputProps={{ readOnly: readOnly === true }}
                                    error={model.polEffDate.showError}
                                    helperText={model.polEffDate.error}

                                />
                            </ContentCell>
                            <ContentCell>
                                <DatePicker
                                    id="polExpDate"
                                    name="polExpDate"
                                    label="Expiration Date"
                                    value={model.polExpDate.value}
                                    fullWidth={true}
                                    onChange={model.handleUserInput}
                                    onBlur={model.handleFinalizeInput}
                                    disabled={ensureNonEmptyString(model.policyID.value) !== true}
                                    variant="outlined"
                                    inputProps={{ readOnly: readOnly === true }}
                                    error={model.polExpDate.showError}
                                    helperText={model.polExpDate.error}
                                />
                            </ContentCell>
                            <ContentCell>
                                <DatePicker
                                    id="retroDate"
                                    name="retroDate"
                                    label="Retro Date"
                                    value={model.retroDate.value}
                                    fullWidth={true}
                                    onChange={model.handleUserInput}
                                    onBlur={model.handleFinalizeInput}
                                    disabled={ensureNonEmptyString(model.policyID.value) !== true}
                                    variant="outlined"
                                    error={model.retroDate.showError}
                                    helperText={model.retroDate.error}
                                    inputProps={{ readOnly: readOnly === true }}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="99%">
                                <TextInput
                                    label="Policy Comments"
                                    name="policyComments"
                                    fullWidth={true}
                                    value={claimModel.policyComments.value}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    onChange={claimModel.handleUserInput}
                                    onBlur={claimModel.handleFinalizeInput}
                                    disabled={claimModel.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.CLOSED || claimModel.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.ERROR}
                                    inputProps={{ maxLength: 1024 }}
                                />
                            </ContentCell>
                        </ContentRow>
                    </>
            }

        </>
    );
}

const datesRule = new ModelRule((data) => {
    return DateRules('pollEffDate').mustBeBefore('polExpDate', data);
});

const schema = new Schema([datesRule]);

schema.bindProperty('claimPolicyID')
    .bindProperty('claimMasterID')
    .bindProperty('policyID', [Required, Pattern(/^[a-z0-9]{1,10}$/i, 'Must be alphanumeric characters')])
    .bindProperty('insuredName', [MaxLength(100)], { allowInvalidValues: false })
    .bindProperty('polEffDate')
    .bindProperty('polExpDate')
    .bindProperty('retroDate')
    .bindProperty('active', [], {}, true)
    .bindProperty('createdBy')
    .bindProperty('createdDate');

export const ManualPolicyInfo = asForm(ManualPolicyInfoForm, schema);
