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
    Phone,
    MaxLength
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    IsoDate,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import { DATE_FORMATS, G2Date } from '../../../../../../../../../../Core/Utility/G2Date';
import { safeObj, safeStr } from '../../../../../../../../../../Core/Utility/safeObject';
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
const GenesisAckLetter = ({ model }) => {

    return (
        <>
            <FieldContainer>
                <TextInput
                    id="ClaimID"
                    label="Claim Number"
                    value={model.ClaimID.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.ClaimID.showError}
                    helperText={model.ClaimID.helperText}
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
                    id="ClaimExaminerName"
                    label="Examiner Name"
                    value={model.ClaimExaminerName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminerName.showError}
                    helperText={model.ClaimExaminerName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimExaminerEmail"
                    label="Examiner Email"
                    value={model.ClaimExaminerEmail.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.ClaimExaminerEmail.showError}
                    helperText={model.ClaimExaminerEmail.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimExaminerPhone"
                    label="Examiner Phone"
                    value={model.ClaimExaminerPhone.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="15"
                    error={model.ClaimExaminerPhone.showError}
                    helperText={model.ClaimExaminerPhone.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Claimants"
                    label="Claimants"
                    value={model.Claimants.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.Claimants.showError}
                    helperText={model.Claimants.helperText}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Recipient"
                    label="Recipient"
                    value={model.Recipient.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="150"
                    error={model.Recipient.showError}
                    helperText={model.Recipient.helperText}
                />
            </FieldContainer>
            <FieldContainer>
            </FieldContainer>
            <FieldContainer>
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminerName', [Required, MaxLength(255)])
    .bindProperty('ClaimExaminerEmail', [Required, Email, MaxLength(250)])
    .bindProperty('ClaimExaminerPhone', [Required, Phone, MaxLength(20)])
    .bindProperty('ClaimID', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('Claimants', [MaxLength(500)])
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('Recipient', [Required, MaxLength(150)])
    .bindProperty('ClaimExaminerInput', [])
    .bindProperty('TodayDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.US_DATE_ONLY)));

export const GenesisAckLetterForm = asForm(GenesisAckLetter, schema);

export const getGenesisAckLetterData = (existing, dataContext) => {

    const { claim } = dataContext

    const { examiner = {} } = safeObj(claim);
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(examiner);

    const defaults = {
        ClaimID: claim.claimID,
        ClaimExaminerName: `${e.firstName || ''} ${e.lastName || ''}`,
        ClaimExaminerPhone: e.businessPhone || '',
        ClaimExaminerEmail: e.emailAddress || '',
        PolicyNumber: safeStr(plc.policyID),
        InsuredName: safeStr(plc.insuredName),
        DateOfLoss: (claim.dOL || ''),
        Claimants: '',
        Recipient: '',
    };

    return {
        ...defaults,
        ...(existing || {}),
        TodayDate: (new G2Date(Date.now())).format(DATE_FORMATS.US_DATE_ONLY),
    };
}
