import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    TextInput
} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    Email,
    Phone,
    MaxLength
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import {
    DATE_FORMATS,
    G2Date
} from '../../../../../../../../../../Core/Utility/G2Date';
import {
    safeObj
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
const VendorLetter = ({ model }) => {

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
                    id="ClaimExaminerFullName"
                    label="Examiner Name"
                    value={model.ClaimExaminerFullName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminerFullName.showError}
                    helperText={model.ClaimExaminerFullName.helperText}
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
                    id="ClaimExaminerPhoneNumber"
                    label="Examiner Phone"
                    value={model.ClaimExaminerPhoneNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="15"
                    error={model.ClaimExaminerPhoneNumber.showError}
                    helperText={model.ClaimExaminerPhoneNumber.helperText}
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
                    id="Narrative"
                    label="Narrative"
                    value={model.Narrative.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    multiline={true}
                    rows="6"
                    error={model.Narrative.showError}
                    helperText={model.Narrative.helperText}
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminerFullName', [Required, MaxLength(255)])
    .bindProperty('ClaimExaminerEmail', [Required, Email, MaxLength(250)])
    .bindProperty('ClaimExaminerPhoneNumber', [Required, Phone, MaxLength(20)])
    .bindProperty('ClaimID', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('Claimants', [MaxLength(500)])
    .bindProperty('DateOfLoss', [Required])
    .bindProperty('Narrative', [MaxLength(500)])
    .bindProperty('TodayDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.US_DATE_ONLY)));

export const VendorLetterForm = asForm(VendorLetter, schema);

export const getVendorLetterData = (existingVal, dataContext) => {

    const { claim } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defaults =  {
        ClaimID: claim.claimID,
        ClaimExaminerFullName: `${e.firstName || ''} ${e.lastName || ''}`,
        ClaimExaminerPhoneNumber: e.businessPhone || '',
        ClaimExaminerEmail: e.emailAddress || '',
        PolicyNumber: plc.policyID,
        InsuredName: plc.insuredName,
        DateOfLoss: (claim.dOL || ''),
        Claimants: '',
        Narrative: '',
    };

    return {
        ...defaults,
        ...(safeObj(existingVal)),
        TodayDate: (new G2Date(Date.now())).format(DATE_FORMATS.US_DATE_ONLY),
    };
}