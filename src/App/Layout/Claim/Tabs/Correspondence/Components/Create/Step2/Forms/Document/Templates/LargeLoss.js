import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    TextInput,} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    Email,
    MaxLength,
    EmailList,
    Currency
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    IsoDate,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import {
    DATE_FORMATS,
    G2Date
} from '../../../../../../../../../../Core/Utility/G2Date';
import {
    safeObj,
    safeStr
} from '../../../../../../../../../../Core/Utility/safeObject';
import {
    ensureNonEmptyString
} from '../../../../../../../../../../Core/Utility/rules';
import { useSelector } from 'react-redux';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { ArrayDropdown } from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const LargeLoss = ({ model }) => {

    const riskStates = useSelector(riskStatesSelectors.selectData());

    return (
        <>
            <FieldContainer>
                <TextInput
                    id="ClaimNumber"
                    label="Claim Number"
                    value={model.ClaimNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.ClaimNumber.showError}
                    helperText={model.ClaimNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PolicyNumber"
                    label="Policy Number"
                    value={model.PolicyNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.PolicyNumber.showError}
                    helperText={model.PolicyNumber.helperText}
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
                    id="ReserveAmount"
                    label="Reserve Amount"
                    value={model.ReserveAmount.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="25"
                    error={model.ReserveAmount.showError}
                    helperText={model.ReserveAmount.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="DateOfLoss"
                    name="DateOfLoss"
                    label="Date of Loss"
                    fullWidth={true}
                    value={model.DateOfLoss.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.DateOfLoss.showError}
                    helperText={model.DateOfLoss.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="TypeOfLoss"
                    label="Type of Loss"
                    value={model.TypeOfLoss.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.TypeOfLoss.showError}
                    helperText={model.TypeOfLoss.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <ArrayDropdown
                    id="State"
                    label="Loss State"
                    list={riskStates}
                    valueProp="stateCode"
                    displayProp="stateName"
                    value={model.State.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.State.showError}
                    helperText={model.State.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimExaminer"
                    label="Examiner Name"
                    value={model.ClaimExaminer.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminer.showError}
                    helperText={model.ClaimExaminer.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ToEmailAddress"
                    label="To Email"
                    value={model.ToEmailAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ToEmailAddress.showError}
                    helperText={model.ToEmailAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CCEmailAddress"
                    label="CC Email"
                    value={model.CCEmailAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.CCEmailAddress.showError}
                    helperText={model.CCEmailAddress.helperText}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="UserInput"
                    label="Document Text"
                    value={model.UserInput.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.UserInput.showError}
                    helperText={model.UserInput.helperText}
                    required
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminer', [Required, MaxLength(255)])
    .bindProperty('ToEmailAddress', [Required, Email, MaxLength(250)])
    .bindProperty('CCEmailAddress', [EmailList, MaxLength(500)])
    .bindProperty('ClaimNumber', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('UserInput', [Required])
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('TypeOfLoss', [Required])
    .bindProperty('State', [Required])
    .bindProperty('ReserveAmount', [Required, Currency])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const LargeLossForm = asForm(LargeLoss, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 * @param {Array<import('../../../../../../../../../../Core/State/slices/metadata/risk-states/types.d').RiskState>} states
 */
export const getLargeLossData = (existingVal, dataContext) => {

    const { claim, email, states } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defStateObj = (ensureNonEmptyString(claim.lossLocation) ? states.find(s => s.riskStateID === parseInt(claim.lossLocation)) : null);

    const defaults = {
        ClaimNumber: claim.claimID,
        ToEmailAddress: safeStr(safeObj(email).to),
        CCEmailAddress: safeStr(safeObj(email).cc),
        ClaimExaminer: `${e.firstName || ''} ${e.lastName || ''}`,
        PolicyNumber: plc.policyID,
        InsuredName: plc.insuredName,
        DateOfLoss: (claim.dOL || ''),
        ReserveAmount: '1,000',
        TypeOfLoss: safeStr(claim.lossDesc),
        State: safeStr(safeObj(defStateObj).stateCode),
        UserInput: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}