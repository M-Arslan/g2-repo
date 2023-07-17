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
    EmailList
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
const InternalAdjustmentToBroker = ({ model }) => {

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
                <DatePicker
                    id="EffectiveDate"
                    name="EfectiveDate"
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
                    disableFuture={false}
                    error={model.ExpirationDate.showError}
                    helperText={model.ExpirationDate.helperText}
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
                    id="RecipientName"
                    label="Recipient Name"
                    value={model.RecipientName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.RecipientName.showError}
                    helperText={model.RecipientName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="DateReceived"
                    name="DateReceived"
                    label="Date Received"
                    fullWidth={true}
                    value={model.DateReceived.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.DateReceived.showError}
                    helperText={model.DateReceived.helperText}
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
    .bindProperty('EffectiveDate', [Required], { beforeSet: IsoDate })
    .bindProperty('ExpirationDate', [Required], { beforeSet: IsoDate })
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('RecipientName', [Required, MaxLength(500)])
    .bindProperty('DateReceived', [Required])
    .bindProperty('TodaysDate', [], { }, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const InternalAdjustmentToBrokerForm = asForm(InternalAdjustmentToBroker, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getInternalAdjustmentToBrokerData = (existingVal, dataContext) => {

    const { claim, email } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);
    
    const defaults = {
        ClaimNumber: claim.claimID,
        ToEmailAddress: safeStr(safeObj(email).to),
        CCEmailAddress: safeStr(safeObj(email).cc),
        ClaimExaminer: `${e.firstName || ''} ${e.lastName || ''}`,
        PolicyNumber: plc.policyID,
        InsuredName: plc.insuredName,
        DateOfLoss: safeStr(claim.dOL),
        EffectiveDate: plc.effectiveDate,
        ExpirationDate: plc.expirationDate,
        RecipientName: '',
        DateReceived: safeStr(claim.dateReceived),
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}