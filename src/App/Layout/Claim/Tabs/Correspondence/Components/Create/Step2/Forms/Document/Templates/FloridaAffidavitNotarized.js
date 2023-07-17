import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    TextInput,} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    MaxLength,
    Currency,
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    IsoDate,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import {
    safeObj,
    safeStr
} from '../../../../../../../../../../Core/Utility/safeObject';
import {
    ensureNonEmptyString,
} from '../../../../../../../../../../Core/Utility/rules';
import { useSelector } from 'react-redux';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { ArrayDropdown } from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';
import { FormatMoneyString } from '../../../../../../../../../../Core/Providers/FormProvider/actions/CommonActions';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const FloridaAffidavitNotarized = ({ model }) => {

    const riskStates = useSelector(riskStatesSelectors.selectData());

    return (
        <>
            <FieldContainer>
                <TextInput
                    id="ClaimPolicyID"
                    label="Policy Number"
                    value={model.ClaimPolicyID.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.ClaimPolicyID.showError}
                    helperText={model.ClaimPolicyID.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="InsuredName"
                    label="Insured Name"
                    value={model.InsuredName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.InsuredName.showError}
                    helperText={model.InsuredName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="InsuredAddress"
                    label="Insured Address"
                    value={model.InsuredAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.InsuredAddress.showError}
                    helperText={model.InsuredAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="EachClaim"
                    label="Per Claim Limit"
                    value={model.EachClaim.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="25"
                    error={model.EachClaim.showError}
                    helperText={model.EachClaim.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AggregateLimit"
                    label="Aggregate Limit"
                    value={model.AggregateLimit.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="25"
                    error={model.AggregateLimit.showError}
                    helperText={model.AggregateLimit.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="AppearedOnDate"
                    name="AppearedOnDate"
                    label="Appeared On Date"
                    fullWidth={true}
                    value={model.AppearedOnDate.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.AppearedOnDate.showError}
                    helperText={model.AppearedOnDate.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="EffectiveDate"
                    name="EffectiveDate"
                    label="Policy Effective Date"
                    fullWidth={true}
                    value={model.EffectiveDate.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.EffectiveDate.showError}
                    helperText={model.EffectiveDate.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="ExpirationDate"
                    name="ExpirationDate"
                    label="Policy Expiration Date"
                    fullWidth={true}
                    value={model.ExpirationDate.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.ExpirationDate.showError}
                    helperText={model.ExpirationDate.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="DescriptionOfInquiry"
                    label="Description of Injury"
                    value={model.DescriptionOfInquiry.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.DescriptionOfInquiry.showError}
                    helperText={model.DescriptionOfInquiry.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <ArrayDropdown
                    id="StateOfLossLocation"
                    label="Loss State"
                    list={riskStates}
                    valueProp="stateName"
                    displayProp="stateName"
                    value={model.StateOfLossLocation.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.StateOfLossLocation.showError}
                    helperText={model.StateOfLossLocation.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CountyOfLossLocation"
                    label="Loss County"
                    value={model.CountyOfLossLocation.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.CountyOfLossLocation.showError}
                    helperText={model.CountyOfLossLocation.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="EmployeeName"
                    label="Employee Name"
                    value={model.EmployeeName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.EmployeeName.showError}
                    helperText={model.EmployeeName.helperText}
                    required
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('StateOfLossLocation', [Required, MaxLength(50)])
    .bindProperty('CountyOfLossLocation', [Required, MaxLength(100)])
    .bindProperty('AppearedOnDate', [Required], { beforeSet: IsoDate })
    .bindProperty('DescriptionOfInquiry', [Required, MaxLength(255)])
    .bindProperty('ClaimPolicyID', [Required, MaxLength(50)])
    .bindProperty('InsuredAddress', [Required, MaxLength(500)])
    .bindProperty('EffectiveDate', [Required], { beforeSet: IsoDate })
    .bindProperty('ExpirationDate', [Required], { beforeSet: IsoDate })
    .bindProperty('EmployeeName', [Required, MaxLength(200)])
    .bindProperty('EachClaim', [Required, Currency], { beforeSet: FormatMoneyString })
    .bindProperty('AggregateLimit', [Required, Currency], { beforeSet: FormatMoneyString });

export const FloridaAffidavitNotarizedForm = asForm(FloridaAffidavitNotarized, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 * @param {Array<import('../../../../../../../../../../Core/State/slices/metadata/risk-states/types.d').RiskState>} states
 */
export const getFloridaAffidavitNotarizedData = (existingVal, dataContext) => {

    const { claim, states } = dataContext;
    const pol = getRealPolicy(safeObj(claim), dataContext.assocPolicies);

    const defStateObj = (ensureNonEmptyString(claim.lossLocation) ? states.find(s => s.riskStateID === parseInt(claim.lossLocation)) : null);

    const defaults = {
        InsuredName: pol.insuredName,
        StateOfLossLocation: safeStr(safeObj(defStateObj).stateName),
        CountyOfLossLocation: '',
        AppearedOnDate: '',
        DescriptionOfInquiry: '',
        ClaimPolicyID: pol.policyID,
        InsuredAddress: pol.insuredAddress,
        EffectiveDate: pol.effectiveDate,
        ExpirationDate: pol.expirationDate,
        EachClaim: '',
        AggregateLimit: '',
        EmployeeName: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        //TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}